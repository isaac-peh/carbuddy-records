import { Car } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border/50 bg-secondary/30 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary shadow-soft">
                <Car className="w-4 h-4 text-primary-foreground" strokeWidth={1.5} />
              </div>
              <span className="text-base font-bold text-foreground tracking-tight">Mobilis</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your trusted vehicle history and service tracking platform.
            </p>
          </div>

          {/* Links */}
          {[
            { title: "Product", links: ["Features", "Pricing", "API"] },
            { title: "Company", links: ["About", "Blog", "Careers"] },
            { title: "Support", links: ["Help Center", "Contact", "Privacy Policy"] },
          ].map((section) => (
            <div key={section.title} className="space-y-3">
              <h4 className="text-sm font-semibold text-foreground">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border/50 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground">© 2026 Mobilis. All rights reserved.</p>
          <div className="flex gap-4">
            {["Terms", "Privacy", "Cookies"].map((item) => (
              <a key={item} href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
