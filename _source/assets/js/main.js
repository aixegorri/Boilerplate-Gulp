/**
 * Initialize SN object
 */
SN.init = function() {
	SN.cache.init();
	SN.cookies.init();
}

$(function() {

	SN.init();

});
