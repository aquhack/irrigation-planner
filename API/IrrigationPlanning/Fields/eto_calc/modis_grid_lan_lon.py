import math
from pyproj import Proj
from decimal import Decimal, getcontext

CELLS = 2400
VERTICAL_TILES = 18
HORIZONTAL_TILES = 36
EARTH_RADIUS = 6371007.181
EARTH_WIDTH = 2 * math.pi * EARTH_RADIUS

TILE_WIDTH = EARTH_WIDTH / HORIZONTAL_TILES
TILE_HEIGHT = TILE_WIDTH
CELL_SIZE = TILE_WIDTH / CELLS

MODIS_GRID = Proj(f'+proj=sinu +R={EARTH_RADIUS} +nadgrids=@null +wktext')


def lon_lat_to_modis(lon, lat):
    x, y = MODIS_GRID(lon, lat)
    h = (EARTH_WIDTH * .5 + x) / TILE_WIDTH
    v = -((EARTH_WIDTH * .25 + y)/TILE_HEIGHT - VERTICAL_TILES)
    return h, v


def lon_lat_to_tiles(lon, lat):
    h, v = lon_lat_to_modis(lon, lat)
    return int(h), int(v)


def lon_lat_to_indeces(lon, lat):
    h, v = lon_lat_to_modis(lon, lat)
    return int((h-int(h))*CELLS), int((v-int(v))*CELLS)
