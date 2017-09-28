const CDP = require('chrome-remote-interface');
const fs = require("fs")

CDP((client) => {
  // Extract used DevTools domains.
  const { Page, Runtime } = client;

  // Enable events on domains we are interested in.
  Promise.all([
    Page.enable()
  ]).then(() => {
    return Page.navigate({ url: 'https://www.amazon.com/gp/goldbox' });
  });

  // Evaluate outerHTML after page has loaded.
  Page.loadEventFired(() => {

    Runtime.evaluate({ expression: "var jq = document.createElement('script');jq.src = \"https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js\";document.getElementsByTagName('head')[0].appendChild(jq);jQuery.noConflict();" })
    Runtime.evaluate({ expression: "window.scrollTo(0, document.body.scrollHeight)" })
    setTimeout(function () {
      Runtime.evaluate({ expression: 'jQuery(".dealContainer").toArray().length'}).then((a) => {
        console.log("111111111111----------------------------")
        for (var b in a){
          console.log(b)
        }
        console.log("22222222222222222----------------------------")
        for (var b in a.result){
          console.log(b)
        }
        console.log("3333333333333333333----------------------------")
        for (var b in a.result){
          console.log(a.result[b])
        }
        console.log("4444444444444444----------------------------")
        console.log(a.result.value);
        
        // fs.writeFile("output.html", , function (error) {
        //   console.log("Done...");
        // })
        client.close();
      });
    }, 2000);
  });
}).on('error', (err) => {
  console.error('Cannot connect to browser:', err);
});