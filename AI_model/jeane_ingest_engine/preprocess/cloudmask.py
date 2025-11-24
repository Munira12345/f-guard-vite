import rasterio
import numpy as np


# Very simple cloud detection using brightness threshold on SWIR/NIR
# For production, use Sen2Cor QA or Fmask algorithms.


def simple_cloud_mask(src_path, out_mask_path, red_band=4, nir_band=8, swir_band=11):
    with rasterio.open(src_path) as src:
        profile = src.profile.copy()
        red = src.read(red_band)
        nir = src.read(nir_band)
        swir = src.read(swir_band)
        # normalize
        redf = red.astype('float32') / 10000.0
        nirf = nir.astype('float32') / 10000.0
        swirf = swir.astype('float32') / 10000.0
        brightness = (redf + nirf + swirf) / 3.0
        mask = (brightness > 0.3).astype('uint8') # threshold; tune per sensor
        profile.update({'count': 1, 'dtype': 'uint8'})
        with rasterio.open(out_mask_path, 'w', **profile) as dst:
            dst.write(mask, 1)
    return out_mask_path