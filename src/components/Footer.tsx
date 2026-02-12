const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h3 className="font-display text-2xl font-bold mb-1">Villa18</h3>
            <p className="font-body text-primary-foreground/60 text-sm">
              Stay Above The Clouds · Kodaikanal
            </p>
          </div>
          <div className="flex gap-8">
            <a href="#about" className="font-body text-sm text-primary-foreground/60 hover:text-accent transition-colors tracking-wider uppercase">
              About
            </a>
            <a href="#rooms" className="font-body text-sm text-primary-foreground/60 hover:text-accent transition-colors tracking-wider uppercase">
              Rooms
            </a>
            <a href="#booking" className="font-body text-sm text-primary-foreground/60 hover:text-accent transition-colors tracking-wider uppercase">
              Book
            </a>
          </div>
          <p className="font-body text-xs text-primary-foreground/40">
            © {new Date().getFullYear()} Villa18. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
