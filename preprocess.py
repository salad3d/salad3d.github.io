from pathlib import Path
from tqdm import tqdm

gen_dir = Path("./assets/3d/generation")
for cat_dir in tqdm(list(gen_dir.glob("*"))):
    if (not cat_dir.is_dir()): continue
    cnt = 0
    for g in cat_dir.glob("*_gaus.obj"):
        m = cat_dir / f"{g.stem[:-5]}.obj"
        print(m)
        assert(m.exists())
        g.rename(cat_dir / f"{cnt}_gaus.obj")
        m.rename(cat_dir / f"{cnt}_mesh.obj")
        cnt += 1
