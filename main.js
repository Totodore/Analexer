const $ = require("jquery");

$(() => {
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
    document.querySelector("textarea").addEventListener("paste", function() {
        let e = $.Event("keydown");
        e.which = 13;
        e.keyCode = 13;
        $(this).trigger(e);
    });
});

function add_element(tag, val) {
    $(".stats_wrapper ul").append("<li></li>")
    $(".stats_wrapper ul").children().last().text(tag + " : " + val);
}
function trigger_stats(self) {
    let text = $(self).val();
    if (text[text.length-1] == " ")
        return;
    else if (text.length < 1) {
        $(".word_stat .inner").children().remove();
        $(".stats_wrapper ul").children().remove();
        return;
    } else {
        $(".word_stat .inner").children().remove();
        $(".stats_wrapper ul").children().remove();
    }
    let words = Array();
    let av_size = 0;
    let av_words = Array();
    text.split(/'| /).forEach(element => {
        av_size += element.length;

        if (element === "l")
            element = "l'";
        
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
    add_element("Nombre de caractères", text.length);
    add_element("Taille moyenne d'un mot", Math.round((av_size * 100) / 100));

    av_words.forEach(element => {
        if (element != " ") {
            $(".word_stat .inner").append("<div></div>");
            $(".word_stat .inner").children().last().addClass("el").text("(" + element[1] + ") : " + element[0]);
        }
    });
}