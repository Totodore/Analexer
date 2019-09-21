const $ = require("jquery");
const fs = require('fs');
let filters = [];
$(() => {
    load_filters();
    $(".text_wrapper textarea").focusin(() => {
        $(".text_wrapper .label").css({
            "top": "-15px",
            "font-size": "0.8em" 
        });
    });
    $(".text_wrapper textarea").focusout(() => {
        if ($(".text_wrapper textarea").val().length < 1)
            $(".text_wrapper .label").removeAttr("style");
    });
    //Event listener for "paste" event
    document.querySelector("textarea").addEventListener("paste", function() {
        let e = $.Event("keydown");
        e.which = 13;
        e.keyCode = 13;
        $(this).trigger(e);
    });
    $("textarea").on("input", function() {
        $(".word_stat .back").css("opacity", 0);
        trigger_stats($(this).val());
        $(".word_stat .label").text("Analyse du texte :").css("left", "0px");
    });
    $(".word_stat .back").click(function() {
        trigger_stats($("textarea").val());
        $(this).css("opacity", 0);
        $(".word_stat .label").text("Analyse du texte :").css("left", "0px");
    });
    $(".new_filter").click(() => {
        $(".word_filter .inner").prepend("<span class='element'><input type='text'/><i onclick='remove_filter(this)'>X</i></span>");
        $(".word_filter .inner").children().first().find("input").focus();
        $("input").keyup(function(e) {
            parse_filter();
            trigger_stats($("textarea").val());
            if (e.keyCode == 27) {
                $(this).blur();
                save_filters();
            } else if (e.keyCode == 13) {
                $(".new_filter").click();
                save_filters();
            } else if (e.keyCode == 32) {
                $(this).val($(this).val().substr(0, $(this).val().length-1));
            }
        });
    });
});

function add_element(tag, val) {
    $(".global_stats .inner").append("<li></li>");
    $(".global_stats .inner").children().last().text(tag + " : " + val);
}

//Fonction d'analyse du texte
function trigger_stats(text) {
    console.log("trigger");
    $(".word_stat .inner").children().remove();
    $(".global_stats ul").children().remove();
    if (text.length < 1)
        return;

    let words = Array();
    let av_size = 0;    //Taille moyenne d'un mot
    let av_words = Array(); //Classement des mots
    
    text.toLowerCase().split(/[\s,\n\t'.;?!:)(\[\]\" ]+/).forEach(element => {
        av_size += element.length; 
        if (element.length == 0)
            return;

        //traitement des filtres
        if (filters.includes(element))
            return;

        let key = -1;
        av_words.forEach(word => {
            if (word[0] == element)
                key = av_words.indexOf(word);      
        }); 
        if (key > -1) {
            av_words[key][1] += 1;
        } else {
            av_words.push([element, 1]);
        }

        words.push(element);
    });

    av_words.sort((a, b) => {
        if (a[1] > b[1]) return -1;
        else return 1;
    });

    av_size = av_size/words.length;


    add_element("Nombre de mots", words.length);
    add_element("Nombre de caractères", text.replace(" ", "").length);
    add_element("Taille moyenne d'un mot", Math.round((av_size * 100) / 100));

    av_words.forEach(element => {
        $(".word_stat .inner").append("<div></div>");
        $(".word_stat .inner").children().last().addClass("el").text("(" + element[1] + ") : " + element[0]);
    });

    
}
//Fonction déclenchée lors de la selection d'un texte dans le texte area
function trigger_select(self) {
    trigger_stats(window.getSelection().toString());
    $(".word_stat .label").text("Analyse de la sélection :").css("left", "30px");
    $(".word_stat .back").css("opacity", 1);
}
function remove_filter(self) {
    $(self).parent().remove();
    filters.splice(filters.indexOf($(self).siblings("input").val()), 1);
    parse_filter();
    save_filters();
}
function parse_filter() {
    filters = [];
    $(".word_filter .inner").children().each(function() {
        filters.push($(this).find("input").val());
    });
    return filters;
    
}
function save_filters(wipe) {
    let data = "";
    if (!wipe)
        data = JSON.stringify(filters);
    fs.writeFile("save.json", data, {
        encoding: 'utf8',
        flag: 'w'
    }, (error) => {
        console.log("error while saving file : ", error);
    });
}
function load_filters() {
    try {
        filters = JSON.parse(fs.readFileSync("save.json"));        
    } catch (error) {
        save_filters(true);
        console.log(error);
        return;
    }
    filters.forEach(filter => {
        $(".word_filter .inner").prepend("<span class='element'><input type='text' value='"+filter+"'/><i onclick='remove_filter(this)'>X</i></span>");
    });
    $("input").keyup(function(e) {
        parse_filter();
        trigger_stats($("textarea").val());
        if (e.keyCode == 27) {
            $(this).blur();
            save_filters();
        } else if (e.keyCode == 13) {
            $(".new_filter").click();
            save_filters();
        } else if (e.keyCode == 32) {
            $(this).val($(this).val().substr(0, $(this).val().length-1));
        }
    });
}

// export class MenuHandler {
//     constructor() {

//     }
//     static removeFilters() {
//         $(".word_filter .inner").children().remove();
//         filters = [];
//     }
// }