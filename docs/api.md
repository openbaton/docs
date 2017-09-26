<div id="swagger-ui"></div>
<script>
  window.onload = function(){
    loadSwagger("api.json");
      function loadSwagger(urls) {
          // Build a system
          const ui = SwaggerUIBundle({
              url: urls,
              dom_id: '#swagger-ui',
              presets: [
                  SwaggerUIBundle.presets.apis,
                  SwaggerUIStandalonePreset
              ],
              plugins: [
                  SwaggerUIBundle.plugins.DownloadUrl
              ],
              layout: "StandaloneLayout"
          })

          window.ui = ui
      }
  }
</script>
