$(document).ready(function () {

        let $c1 = $("#contactsContainer1");
        let $c2 = $("#contactsContainer2");
        let $c3 = $("#impressum");

        let email = atob("c3ljaEBzeWNoLnRlY2g");
        let li = atob("aHR0cHM6Ly93d3cubGlua2VkaW4uY29tL2luL3NsYXZhLXlhdHNraW4v");
        let gh = atob("aHR0cHM6Ly9naXRodWIuY29tL1plcjBEaXZpczBy");
        let name = atob("U2xhdmEgWWF0c2tpbg");
        let legal_name = atob("TWV0YWZvcm0");

        let legal_address = atob("TmV1ZSBTY2hvbmhhdXNlcnN0cmFzc2UgMy01LCAxMDE3OCBCZXJsaW4");
        let legal_vat = atob("REUzNTYxNDU5NTc");


        $c1.find("[data-reference=mail]").text(email).attr("href", "mailto:" + email);
        $c2.find("[data-reference=mail]").attr("href", "mailto:" + email);

        $c1.find("[data-reference=li]").attr("href", li);
        $c2.find("[data-reference=li]").attr("href", li);

        $c1.find("[data-reference=gh]").attr("href", gh);
        $c2.find("[data-reference=gh]").attr("href", gh);

        $c3.find("[data-reference=legal_address]").text(legal_address);
        $c3.find("[data-reference=legal_vat]").text(legal_vat);
        $c3.find("[data-reference=legal_name]").text(legal_name);

        $("[data-reference=name]").text(name);

        $("[data-reference=year]").text(new Date().getFullYear());

    }
)
