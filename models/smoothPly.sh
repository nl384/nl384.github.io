#!/bin/bash 
# should be given mesh and trimesh directory

PLY=$1
FILENAME=${PLY%????}
TRIMESH_DIR=$2

$TRIMESH_DIR/bin.Darwin64/mesh_filter $PLY -smoothnorm 0.1 $FILENAME"_smooth1.ply"
$TRIMESH_DIR/bin.Darwin64/mesh_filter $PLY -smoothnorm 0.3 $FILENAME"_smooth3.ply"
$TRIMESH_DIR/bin.Darwin64/mesh_filter $PLY -smoothnorm 0.5 $FILENAME"_smooth5.ply"

