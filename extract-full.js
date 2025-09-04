javascript:(function(){ 
    var scripts = document.getElementsByTagName("script"),
        regex = /(?<=(\"|\%27|\`))\/[a-zA-Z0-9_?&=\/\-\#\.]*(?=(\"|\'|\%60))/g;
    const results = new Set;

    function makeFullUrl(path) {
        try {
            return new URL(path, location.origin).href; // convert to absolute URL
        } catch (e) {
            return path;
        }
    }

    for (var i=0;i<scripts.length;i++){
        var t=scripts[i].src;
        if(t!=""){
            fetch(t).then(function(res){return res.text()})
            .then(function(text){
                var e=text.matchAll(regex);
                for(let r of e) results.add(makeFullUrl(r[0]));
            })
            .catch(function(err){console.log("An error occurred: ",err)});
        }
    }

    var pageContent=document.documentElement.outerHTML,
        matches=pageContent.matchAll(regex);

    for(const match of matches) results.add(makeFullUrl(match[0]));

    function writeResults(){
        var newTab=window.open("", "_blank");
        if(newTab){
            results.forEach(function(t){newTab.document.write(t+"<br>")});
            newTab.document.close();
        } else {
            results.forEach(function(t){document.write(t+"<br>")});
        }
    }
    setTimeout(writeResults,3000);
})();
