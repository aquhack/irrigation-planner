from pymodis import downmodis
import glob
import modis_grid_lan_lon as md
from shapely.geometry import Point
from shapely.geometry import Polygon
from datetime import date
import gdal
import os

# Variables for data download
# This directory must already exist BTW
# dest = "data/"
# tiles = "h18v03"  # That's the MODIS tile covering northern Europe
# day = "2020.06.01"
product = "MOD13A1.006"


# Instantiate download class, connect and download
def download_files(dest, tiles):
    modis_down = downmodis.downModis(destinationFolder=dest, tiles=tiles, delta=1, product=product)
    if len(modis_down.fileInPath) < 4:
        modis_down.connect()
        modis_down.downloadsAllDay()


def get_ndvi(dest, tiles, today):
    download_files(dest, tiles)
    MODIS_files = glob.glob(dest + '*.hdf')
    # Check that the data has been downloaded
    sds = gdal.Open(MODIS_files[0], gdal.GA_ReadOnly).GetSubDatasets()
    vi_src = gdal.Open(sds[0][0])
    vi_np = vi_src.ReadAsArray()
    return vi_np


def mean_ndvi():
    today = date.today()
    area = [(60, 40), (61, 40), (61, 45),
            (60, 45), (60, 40)]
    h, v = md.lon_lat_to_tiles(min(area)[0], min(area)[0])
    tiles = 'h' + str(h).zfill(2) + 'v' + str(v).zfill(2)
    dest = 'data/'+str(today)+tiles+'/'

    ndvi = get_ndvi(dest, tiles, today)
    area_i_j = [(md.lon_lat_to_indeces(lon, lat)) for (lon, lat) in area]
    pol = Polygon(area_i_j)
    min_i = min(area_i_j)[0]
    max_i = max(area_i_j)[0]
    min_j = min(area_i_j)[1]
    max_j = max(area_i_j)[1]
    sum_ndvi = 0
    size = 0
    for i in range(min_i, max_i):
        for j in range(min_j, max_j):
            if pol.contains(Point(i, j)):
                sum_ndvi = sum_ndvi + ndvi[i][j]
                size = size + 1

    return sum_ndvi / size

mean_ndvi()