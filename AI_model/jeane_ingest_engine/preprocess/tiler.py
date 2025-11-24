import os
import math
import rasterio
from rasterio.windows import Window
from affine import Affine




def tile_raster(src_path, out_dir, tile_size=512, overlap=0):
    os.makedirs(out_dir, exist_ok=True)
    with rasterio.open(src_path) as src:
        meta = src.meta.copy()
        width = src.width
        height = src.height
        xsteps = math.ceil((width - overlap) / (tile_size - overlap))
        ysteps = math.ceil((height - overlap) / (tile_size - overlap))
        count = 0
        for y in range(ysteps):
            for x in range(xsteps):
                xoff = x * (tile_size - overlap)
                yoff = y * (tile_size - overlap)
                w = min(tile_size, width - xoff)
                h = min(tile_size, height - yoff)
                window = Windo