/* Set the width of the side navigation to 250px */
function openRightNav() {
    document.getElementById("myRightSidenav").style.width = "20%";
}

/* Set the width of the side navigation to 0 */
function closeRightNav() {
    document.getElementById("myRightSidenav").style.width = "0";
}

/* Set the width of the side navigation to 250px and the left margin of the page content to 250px */
function openSearchNav() {
	console.log ("in openSearchNav");
    document.getElementById("mySearchSidenav").style.width = "250px";
    document.getElementById("main").style.marginRight = "250px";
}

/* Set the width of the side navigation to 0 and the left margin of the page content to 0 */
function closeSearchNav() {
    document.getElementById("mySearchSidenav").style.width = "0";
    document.getElementById("main").style.marginRight = "0";
}

