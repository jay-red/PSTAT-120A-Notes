/*
 * Object Types
 * Section
 * Bullet
 * Numeral
 * Text
 */

var numerals = [
		[ 1, "I" ],
		[ 5, "V" ],
		[ 10, "X" ],
		[ 50, "L" ],
		[ 100, "C" ],
		[ 500, "D" ]
	];

function decimalToRoman( n ) {
	if( n < 0 || n > 888 ) return "";
	var romanStr = "",
		count;
	for( var i = numerals.length - 1; i >= 0; i-- ) {
		count = 0;
		while( numerals[ i ][ 0 ] <= n ) {
			console.log( numerals[ i ][ 0 ] );
			n -= numerals[ i ][ 0 ];
			romanStr += numerals[ i ][ 1 ];
			count++;
			if( count == 4 ) {
				romanStr = romanStr.substr( 0, romanStr.length - 5 );
				romanStr += numerals[ i ][ 1 ] + numerals[ i + 1 ][ 1 ];
			}
		}
	}
	return romanStr;
}

var noteSource = document.getElementById( "noteSource" ),
	xhr = new XMLHttpRequest(),
	lectureData;	

function renderText( base, derived, depth ) {
	var content = document.createElement( "p" );
	content.innerHTML = derived[ "data" ];
	base.append( content );
}

function renderArray( base, derived, depth ) {
	var arrayStr = "$";
	if( !derived[ "inline" ] ) arrayStr += "$";
	arrayStr += " \\begin{array}{" + derived[ "columns" ] + "} ";
	for( var i = 0; i < derived[ "rows" ].length; i++ ) {
		arrayStr += " ";
		if( i > 0 ) arrayStr += " \\\\ ";
		if( i == 1 || ( derived[ "hline" ] && i < derived[ "rows" ].length ) && i > 0 ) {
			arrayStr += "\\hline ";
		}
		arrayStr += derived[ "rows" ][ i ];
	}
	arrayStr += " \\end {array} $"
	if( !derived[ "inline" ] ) arrayStr += "$";
	base.innerHTML += arrayStr;
}
	
function renderBullet( base, derived, depth ) {
	var content = document.createElement( "div" );
	content.setAttribute( "class", "bullet" );
	renderObjects( content, derived[ "objects" ], depth + 1 );
	base.append( content );
}

function renderNumeral( base, derived, depth, num ) {
	var numeral = document.createElement( "div" ),
		label = document.createElement( "div" ),
		content = document.createElement( "div" ),
		br = document.createElement( "br" );
	label.innerHTML = decimalToRoman( num );
	label.setAttribute( "class", "numeral-label" );
	content.setAttribute( "class", "numeral-content" );
	renderObjects( content, derived[ "objects" ], depth + 1 );
	br.setAttribute( "style", "clear: both;" );
	numeral.appendChild( label );
	numeral.appendChild( content );
	numeral.appendChild( br );
	numeral.setAttribute( "class", "numeral" )
	base.append( numeral );
}

function renderSection( base, derived, depth ) {
	var section = document.createElement( "div" ),
		label = document.createElement( "div" ),
		content = document.createElement( "div" ),
		br = document.createElement( "br" );
	label.innerHTML = derived[ "title" ];
	label.setAttribute( "class", "section-label" );
	content.setAttribute( "class", "section-content" )
	renderObjects( content, derived[ "objects" ], depth );
	br.setAttribute( "style", "clear: both;" );
	section.appendChild( label );
	section.appendChild( content );
	section.appendChild( br );
	section.setAttribute( "class", "section" )
	base.append( section );
}

function renderHeader( base, derived, depth ) {
	var heading = document.createElement( "h" + depth.toString() ),
		content = document.createElement( "div" );
	content.setAttribute( "class", "header-content" );
	heading.innerHTML = derived[ "title" ];
	renderObjects( content, derived[ "objects" ], depth + 1 );
	base.append( heading );
	base.append( content );
}

function renderObjects( base, objects, depth ) {
	var derivedObj,
		num = 1, 
		last = "";
	for( var i = 0; i < objects.length; i++ ) {
		derivedObj = objects[ i ];
		switch( derivedObj[ "type" ] ) {
			case "header":
				renderHeader( base, derivedObj, depth );
				break;
			case "section":
				renderSection( base, derivedObj, depth );
				break;
			case "bullet":
				renderBullet( base, derivedObj, depth );
				break;
			case "numeral":
				if( last == "numeral" ) num++;
				else num = 1;
				renderNumeral( base, derivedObj, depth, num );
				break;
			case "array":
				renderArray( base, derivedObj, depth );
				break;
			case "text":
				renderText( base, derivedObj, depth );
				break;
			default:
				break;
		}
		last = derivedObj[ "type" ];
	}
}
 
function renderPage() {
	renderHeader( document.getElementById( "content" ), lectureData, 1 );
}
 
xhr.open( "GET", noteSource.href );
xhr.onreadystatechange = function() {
	if( xhr.readyState == 4 && xhr.status == 200 ) {
		lectureData = JSON.parse( xhr.responseText );
		renderPage();
	}
}
xhr.send();

console.log( noteSource.href );