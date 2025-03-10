
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { FileText } from 'lucide-react';

const Footer = () => {
  const { t } = useLanguage();
  
  return (
    <footer className="bg-background border-t py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t('footer_company')}</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-muted-foreground hover:text-foreground transition">{t('nav_about')}</Link></li>
              <li><Link to="/blog" className="text-muted-foreground hover:text-foreground transition">{t('nav_blog')}</Link></li>
              <li><Link to="/changelog" className="text-muted-foreground hover:text-foreground transition flex items-center gap-1.5">
                <FileText size={14} />
                Changelog
              </Link></li>
            </ul>
          </div>
          
          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t('footer_services')}</h3>
            <ul className="space-y-2">
              <li><Link to="/services" className="text-muted-foreground hover:text-foreground transition">{t('service_ai_strategy')}</Link></li>
              <li><Link to="/services" className="text-muted-foreground hover:text-foreground transition">{t('service_chatbots')}</Link></li>
              <li><Link to="/services" className="text-muted-foreground hover:text-foreground transition">{t('service_workflow')}</Link></li>
            </ul>
          </div>
          
          {/* Resources */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t('footer_resources')}</h3>
            <ul className="space-y-2">
              <li><Link to="/blog" className="text-muted-foreground hover:text-foreground transition">{t('footer_case_studies')}</Link></li>
              <li><Link to="/blog" className="text-muted-foreground hover:text-foreground transition">{t('footer_guides')}</Link></li>
              <li><Link to="/blog" className="text-muted-foreground hover:text-foreground transition">{t('footer_faq')}</Link></li>
            </ul>
          </div>
          
          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t('footer_contact')}</h3>
            <ul className="space-y-2">
              <li className="text-muted-foreground">hello@aiautomation.ally</li>
              <li><Link to="/contact" className="text-primary hover:text-primary/80 transition">{t('contact_us')}</Link></li>
              <li className="text-muted-foreground">Oslo, Norway</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} AI Automation Ally. {t('footer_rights')}</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="text-muted-foreground hover:text-foreground transition">{t('footer_privacy')}</a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition">{t('footer_terms')}</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
