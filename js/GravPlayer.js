GravCube.GravPlayer = function ( x, y, dir, id, colour ) {

	this.blob = [];

	this.x = x;
	this.y = y;
	this.dir = dir;
	this.id = id;
	this.colour = colour;

	this.numCubes = 21 * 21;

	this.moveDir = 0;
	this.turnDir = 0;
	this.lives = 1;
	this.animTick = 0;
	
	this.turnSpeed = 0;
	this.turnMax = 0.05;
	this.turnAccel = 0.005;

	this.moveSpeed = 0;
	this.moveMax = 2;
	this.moveAccel = 0.08;

	this.beamRadius = 0;
	this.mass = 1;

	this.createBlob = function () {

		for ( int i = 0; i < this.numCubes; i++ ) {
			this.blob[] = null;
		}

	}

	this.prototype.toPos = function ( index ) {

		var x = Math.floor( index % Math.sqrt( this.numCubes ) - ( Math.sqrt( this.numCubes ) - 1 ) / 2 );
		var y = Math.floor( index / Math.sqrt( this.numCubes ) - ( Math.sqrt( this.numCubes ) - 1 ) / 2 );
		return [x, y];

	}

	this.prototype.toIndex = function ( x, y ) {

		return Math.floor( ( x + ( Math.sqrt( this.numCubes ) - 1 ) / 2 ) 
			+ ( y + ( Math.sqrt( this.numCubes ) - 1 ) / 2 ) * Math.sqrt( this.numCubes ) );

	}

	this.move = function ( dir ) {

		this.moveDir = dir;

	}

	this.turn = function ( dir ) {

		this.turnDir = dir;

	}

	this.getMerge = function ( cube ) {

		var magnitude = calcDistance( this.x, this.y, cube.x, cube.y );
		var angle = Math.atan( ( cube.y - this.y ) / ( cube.x - this.x ) ) - ( Math.PI - this.dir );

		if ( this.x < cube.x ) angle -= Math.PI;

		var rx = Math.floor( Math.cos( angle ) * magnitude / CUBE_SIZE );
		var ry = Math.floor( Math.sin( angle ) * magnitude / CUBE_SIZE );
		var index = this.prototype.toIndex( rx, ry );

		try {

			if ( this.blob[ index ] != null ) return -1;

			if ( this.blob[ index + 1 ] == null && this.blob[ index - 1 ] == null 
					&& this.blob[ index + Math.sqrt( this.numCubes ) ] == null
					&& this.blob[ index - Math.sqrt( this.numCubes ) ] == null ) {
				return -1;
			}

			if ( cube.cID == 3 ) {

				var check = { index + 1, index - 1,
					index + Math.sqrt( this.numCubes ), index - Math.sqrt( this.numCubes ) 
				};

				for ( int i = 0; i < check.length; i++ ) {

					if ( this.blob[ check[ i ] ] == null ) continue;

					this.mass -= this.blob[ check[ i ] ].mass;

					switch ( this.blob[ check[ i ] ].cID ) {

					case 0: // WHITE
						this.lives--;
						break;

					case 4:
						this.turnAccel -= 0.01;
						break;

					case 5:
						this.moveAccel -= 0.4;
						break;

					case 6:
						this.beamRadius -= 0.2;
						break;

					}

					this.blob[ check[ i ] ] = null;

				}

				for ( int i = 0; i < MAX_CUBES; i++ ) {

					if ( cubes[ i ] == cube ) {

						cubes[ i ] = null;

					}

				}

				return -1;

			}

			return this.prototype.toIndex( rx, ry );

		} catch ( Exception e ) {

			return -1;

		}

	}

	this.mergeCube = function ( cube, index ) {

		if ( this.blob[ index ] != null ) return false;

		if ( cube.cID == 3 ) return false;

		this.blob[ index ] = cube;
		var xy = this.prototype.toPos( index );

		cube.x = xy[ 0 ] * CUBE_SIZE;
		cube.y = xy[ 1 ] * CUBE_SIZE;

		this.mass += cube.mass;

		switch ( cube.cID ) {

		case 0:
			this.lives++;
			break;

		case 4:
			this.turnAccel += 0.01;
			break;

		case 5:
			this.moveAccel += 0.4;
			break;

		case 6:
			this.beamRadius += 0.2;
			break

		}

		this.beamRadius = Math.max( this.beamRadius, 0 );
		this.moveAccel = Math.max( this.moveAccel, 0.1 );
		this.turnAccel = Math.max( this.turnAccel, 0.01 );
		this.mass = Math.max( this.mass, 1 );

		return true;

	}

	this.isInSight = function ( cube, angle ) {

		angle += Math.PI / 2;

		var lDir = this.dir - this.beamRadius - 0.1;
		var rDir = this.dir + this.beamRadius + 0.1;

	    while (angle > Math.PI) angle -= Math.PI * 2;
	    while (angle <= -Math.PI) angle += Math.PI * 2;
	    while (ldir > Math.PI) ldir -= Math.PI * 2;
	    while (ldir <= -Math.PI) ldir += Math.PI * 2;
	    while (rdir > Math.PI) rdir -= Math.PI * 2;
	    while (rdir <= -Math.PI) rdir += Math.PI * 2;

	    if ( ( -angle >= lDir ) && ( -angle <= rDir ) ) {

	    	return true;

	    }

	    return false;

	}

	this.attract = function () {

		for ( Cube c in cubes ) {

			if ( c == null ) continue;

			if ( calcDistance( this.x, this.y, c.x, c.y ) < this.mass * 17 ) {

				var angle = Math.atan( (this.y - c.y) / ( this.x - c.x ) );

				if ( c.x > this.x ) angle -= Math.PI;

				if ( this.isInSight( c, angle ) ) {

					c.vx += Math.cos( angle ) * this.mass / 10;
					c.vy += Math.sin( angle ) * this.mass / 10;

					c.vx = Math.min( Math.max( c.vx, -0.5 ), 0.5 );
					c.vy = Math.min( Math.max( c.vy, -0.5 ), 0.5 );

				}

			}

		}

	}

	this.update = function () {

		if ( lives <= 0 ) return;

		attract();

		turnSpeed += turnAccel * turnDir / Math.sqrt( mass * 2);

		if ( turnDir == 0 && turnSpeed > 0 ) {

			turnSpeed -= turnAccel / Math.sqrt( mass );
			turnSpeed = Math.max( 0, turnSpeed );

		} else if ( turnDir == 0 && turnSpeed < 0 ) {

			turnSpeed += turnAccel / Math.sqrt( mass );
			turnSpeed = Math.min( 0, turnSpeed );

		}

		turnSpeed = Math.min( Math.max( turnSpeed, -turnMax ), turnMax );

		dir += turnSpeed;

		while ( dir > Math.PI ) dir -= Math.PI * 2;
		while ( dir < -Math.PI ) dir += Math.PI * 2;

		moveSpeed += moveAccel * moveDir / Math.sqrt( mass );
    
	    if (moveDir == 0 && moveSpeed > 0) {

	      moveSpeed -= moveAccel / Math.sqrt( mass );
	      moveSpeed = Math.max( 0, moveSpeed );

	    } else if (moveDir == 0 && moveSpeed < 0) {

	      moveSpeed += moveAccel / Math.sqrt( mass );
	      moveSpeed = Math.min( 0, moveSpeed );

	    }

	    moveSpeed = Math.min( Math.max( moveSpeed, -moveMax ), moveMax );

	    x += Math.sin( dir ) * moveSpeed;
	    y += Math.cos( dir ) * moveSpeed;

	    x = Math.min( Math.max( x, 0 ), WIDTH );
	    y = Math.min( Math.max( y, 0 ), HEIGHT );

	}

	this.draw = function () {

		if ( lives <= 0 ) return;



	}

}