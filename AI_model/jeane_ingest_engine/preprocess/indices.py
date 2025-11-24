    import rasterio
    import numpy as np




    def compute_index(band_a, band_b):
        a = band_a.astype('float32')
        b = band_b.astype('float32')
        
    denom = (a + b)
    denom[denom == 0] = 1e-6
    return (b - a) / denom




    def ndvi_from_path(src_path, out_path, red_index=4, nir_index=8):
        with rasterio.open(src_path) as src:
            red = src.read(red_index)
        nir = src.read(nir_index)
        ndvi = compute_index(red, nir)
        meta = src.meta.copy()
        meta.update({'count': 1, 'dtype': 'float32'})
        with rasterio.open(out_path, 'w', **meta) as dst:
            dst.write(ndvi.astype('float32'), 1)




    def evi_from_path(src_path, out_path, red_index=4, nir_index=8, blue_index=2):
    # EVI = 2.5 * (NIR - RED) / (NIR + 6*RED - 7.5*BLUE + 1)
        with rasterio.open(src_path) as src:
            red = src.read(red_index).astype('float32') / 10000.0
            nir = src.read(nir_index).astype('float32') / 10000.0
            blue = src.read(blue_index).astype('float32') / 10000.0
            denom = (nir + 6.0*red - 7.5*blue + 1.0)
            denom[denom == 0] = 1e-6
            evi = 2.5 * (nir - red) / denom
            meta = src.meta.copy()
            meta.update({'count': 1, 'dtype': 'float32'})
        with rasterio.open(out_path, 'w', **meta) as dst:
            dst.write(evi.astype('float32'), 1)