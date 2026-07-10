const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');

  // Change "cova-auth.html" to "cova-auth.html#login" where the text is "Login"
  // Example: <a class="nav-link" href="cova-auth.html">Login</a>
  content = content.replace(/href="cova-auth\.html"([^>]*)>Login<\/a>/g, 'href="cova-auth.html#login"$1>Login</a>');
  
  if (file === 'cova-auth.html') {
    if (!content.includes('window.location.hash === "#login"')) {
        content = content.replace(
            /<\/script>\s*<script>\s*function toggleMobileMenu/g,
            `  document.addEventListener('DOMContentLoaded', () => {
        if (window.location.hash === '#login' || window.location.hash === '#log-in') {
          switchAuthMode('login');
        }
      });
    </script>
    <script>
      function toggleMobileMenu`
        );
    }
  }

  fs.writeFileSync(file, content);
}
console.log('Fixed login hashes');