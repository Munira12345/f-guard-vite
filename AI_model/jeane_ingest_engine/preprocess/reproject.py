import rasterio
from rasterio.warp import calculate_default_transform, reproject, Resampling




def reproject_to(src_path, dst_path, dst_crs='EPSG:3857'):
    with rasterio.open(src_path) as src:
        transform, width, height = calculate_default_transform(
            src.crs, dst_crs, src.width, src.height, *src.bounds)
        profile = src.profile.copy()
        profile.update({
            'crs': dst_crs,
            'transform': transform,
            'width': width,
            'height': height
        })
    with rasterio.open(dst_path, 'w', **profile) as dst:
        for i in range(1, src.count + 1):
            reproject(
                source=rasterio.band(src, i),
                destination=rasterio.band(dst, i),
                src_transform=src.transform,
                src_crs=src.crs,
                dst_transform=transform,
                dst_crs=dst_crs,
                resampling=Resampling.bilinear)