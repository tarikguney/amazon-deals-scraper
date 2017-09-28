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

    injectjQuery(Runtime);

    Runtime.evaluate({ expression: "window.scrollTo(0, document.body.scrollHeight)" })
    setTimeout(function () {
      Runtime.evaluate({ expression: 'jQuery(".dealContainer").toArray().length' }).then((a) => {

        console.log("---------------- TRAVERSING ROOT OBJECT ---------------------------")
        for (var b in a) {
          console.log(b)
        }
        console.log("---------------- TRAVERSION RESULT PROPERTY -----------------------")
        for (var b in a.result) {
          console.log(b)
        }
        console.log("---------------- TRAVERSING VALUES OF RESULT PROPERTY -------------")
        for (var b in a.result) {
          console.log(a.result[b])
        }
        console.log("---------------- SHOWING THE RESULT -------------------------------")
        console.log(a.result.value);

        // writeToFile(a.result.value);
        
        client.close();
      });
    }, 2000);
  });
}).on('error', (err) => {
  console.error('Cannot connect to browser:', err);
});

function injectjQuery(Runtime) {
  Runtime.evaluate({ expression: "var jq = document.createElement('script');jq.src = \"https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js\";document.getElementsByTagName('head')[0].appendChild(jq);jQuery.noConflict();" })
}

function writeToFile(content) {
  fs.writeFile("OutputFile.txt", content, function (error) {
    if (error != null) {
      console.log(error);
    } else {
      console.log("OutputFile.txt has been saved...");
    }
  });
}