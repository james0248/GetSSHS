class tile {
    tile(rank, x, y) {
        this.rank = rank;
        this.x= x;
        this.y= y;
    }
    
    equalsTo(comp) {
        return comp.rank === this.rank;
    }
}