$(document).ready(function() {
    areaSetSyntax($('[name="htmlCode"]'),"application/x-httpd-php");
    //areaSetSyntax($('[name="params"]'),"application/javascript");
    //areaSetSyntax($('[name="php"]'),"application/x-httpd-php");
});

function areaSetSyntax(argument,mode) {
    var editor = CodeMirror.fromTextArea(argument[0], {
        mode: mode,
        tabMode: "indent",
        readOnly: true
    });
    editor.setOption("theme", "monokai");
    argument.next('div').css({
        'font-size': '16px',
        'text-align': 'left',
        'height': '160%'
    });

}

