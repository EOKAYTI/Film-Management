$(document).ready(function(){
    console.log("check link:",sessionStorage.getItem("oldLink"));
    $("#link-403").attr("href",sessionStorage.getItem("oldLink"));
})