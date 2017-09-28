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
 
    client.DOM.getDocument((error, params) => {
      if (error) {
          console.error(params);
          return;
      }
      const options = {
          nodeId: params.root.nodeId,
          selector: `div[id*='_dealView_'`
      };
      client.DOM.querySelectorAll(options, (error, params) => {
          if (error) {
              console.error(params);
              return;
          }
          params.nodeIds.forEach((nodeId) => {
              const options = {
                  nodeId: nodeId
              };
              client.DOM.getAttributes(options, (error, params) => {
                  if (error) {
                      console.error(params);
                      return;
                  }
                  console.log(params.attributes);
              });
          });
      });
  });


  });
}).on('error', (err) => {
  console.error('Cannot connect to browser:', err);
});

function injectjQuery(Runtime) {
  Runtime.evaluate({
    expression: `var jq = document.createElement('script');
  jq.src = \"https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js\";
  document.getElementsByTagName('head')[0].appendChild(jq);
  jQuery.noConflict();` })
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