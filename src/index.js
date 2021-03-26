//nimgo query
function nq(query,all) {
    if (all) {
        return document.querySelectorAll(query);
    } else {
        return document.querySelector(query);
    }
}
// nimgo dependencies
var nd = {
    scope: {},
    get http() {
        console.warn("The http dependency currently doesn't work, but it should work in a future release.");
        return new Function();
    }
};

function nimgo(deps, call) {
    var list = [];
    for (const dep of deps) {
        if (!(dep in nd)) throw new Error(`Unknown dependency: ${dep}`);
        list.push(nd[dep]);
    }
    call(...list);
}

window.onload = () => {
    a = setInterval(() => {
        for (const elem of nq("*",true)) {
            var list = Array.from(elem.attributes)
            .filter(a => a.nodeName.startsWith("*"));

            for (const attr of list) {
                elem[attr.nodeName.substring(1)] = r(attr.nodeValue);
            }
            var value;
            value = elem.getAttribute("ni-value");
            if (value) {
                nd.scope[value] = elem.value;
            }
            value = elem.getAttribute("ni-bind");
            if (value && elem.innerText != nd.scope[value]) {
                elem.innerText = nd.scope[value] || "";
            }
            value = elem.getAttribute("ni-click");
            if (value) {
                elem.addEventListener("click", () => {
                    with (nd.scope) {
                        eval(value);
                    }
                });
                elem.removeAttribute("ni-click");
            }
        }
    }, 10);
}
/*-----------------------------------------utils-----------------------------------------*/
function r(str) {
    for (const match of str.matchAll("{{[^{}]+}}")) {
        str = str.replace(
            match[0],
            nd.scope[match[0].replace(/{|}/g, "")] || "none"
        );
    }
    return str;
}