"""Install only checksum-verified archives into an ephemeral plugin volume."""
import hashlib, io, json, os, pathlib, re, stat, urllib.request, zipfile
def install(items, root):
    ROOT=pathlib.Path(root)
    for item in items:
        plugin_id,version=item['id'],item['version']
        assert re.fullmatch(r'[a-zA-Z0-9_-]+',plugin_id)
        assert item['url'].startswith('https://') and re.fullmatch('[a-f0-9]{64}',item['sha256'])
        with urllib.request.urlopen(item['url'],timeout=60) as r:
            data=r.read(50_000_001)
        assert len(data)<=50_000_000 and hashlib.sha256(data).hexdigest()==item['sha256'],'Archive checksum mismatch'
        with zipfile.ZipFile(io.BytesIO(data)) as z:
            infos=z.infolist();assert sum(i.file_size for i in infos)<200_000_000,'Unpacked archive too large'
            manifests=[i for i in infos if pathlib.PurePosixPath(i.filename).name=='plugin.json' and len(pathlib.PurePosixPath(i.filename).parts)==2]
            assert len(manifests)==1,'Expected exactly one top-level plugin manifest'
            base=pathlib.PurePosixPath(manifests[0].filename).parts[0]
            manifest=json.loads(z.read(manifests[0]));assert manifest['id']==plugin_id and manifest['info']['version']==version,'Plugin identity mismatch'
            for i in infos:
                p=pathlib.PurePosixPath(i.filename)
                assert not p.is_absolute() and '..' not in p.parts and p.parts[0]==base,'Unsafe archive path'
                assert not stat.S_ISLNK(i.external_attr>>16),'Archive symlink rejected'
                target=ROOT/plugin_id/pathlib.Path(*p.parts[1:])
                if i.is_dir():target.mkdir(parents=True,exist_ok=True)
                else:
                    target.parent.mkdir(parents=True,exist_ok=True);target.write_bytes(z.read(i))
                    target.chmod(0o755 if (i.external_attr>>16)&0o111 else 0o644)

if __name__ == '__main__':
    install(json.loads(os.environ['PLUGIN_ARCHIVES']), '/plugins')
    print('Verified plugin archive installation complete')
