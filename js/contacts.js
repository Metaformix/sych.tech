$(document).ready(function () {

        let $c1 = $("#contactsContainer1");
        let $c2 = $("#contactsContainer2");

        let email = atob("c3ljaEBmb3JtLmNvLmls");
        let li = atob("aHR0cHM6Ly93d3cubGlua2VkaW4uY29tL2luL3NsYXZhLXlhdHNraW4v");
        let gh = atob("aHR0cHM6Ly9naXRodWIuY29tL1plcjBEaXZpczBy");
        let name = atob("U2xhdmEgWWF0c2tpbg");


        $c1.find("[data-reference=mail]").text(email).attr("href", "mailto:" + email);
        $c2.find("[data-reference=mail]").attr("href", "mailto:" + email);

        $c1.find("[data-reference=li]").attr("href", li);
        $c2.find("[data-reference=li]").attr("href", li);

        $c1.find("[data-reference=gh]").attr("href", gh);
        $c2.find("[data-reference=gh]").attr("href", gh);

        $("[data-reference=name]").text(name);

        $("[data-reference=year]").text(new Date().getFullYear());

    }
)
