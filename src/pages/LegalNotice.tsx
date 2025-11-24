import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const LegalNotice = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link to="/">
          <Button variant="ghost" className="mb-6 hover:bg-muted">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        <div className="prose prose-slate dark:prose-invert max-w-none bg-card p-8 rounded-lg shadow-sm border border-border">
          <h1 className="text-3xl font-bold mb-6">Legal Notice – pixel-sans</h1>
          <p className="text-sm text-muted-foreground mb-8">Effective date: November 24, 2025</p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Identification of the Owner</h2>
          <p>
            This website <strong>pixel-sans</strong> is managed by its owner, publicly identified as <strong>pixel-sans</strong>, based in <strong>Colombia</strong>.<br />
            For any communication, you can write to: 📧 <a href="mailto:contacto@pixel-sans.com" className="text-primary hover:underline">contacto@pixel-sans.com</a>.
          </p>

          <hr className="my-8" />

          <h2 className="text-2xl font-semibold mt-8 mb-4">2. Purpose of the Site</h2>
          <p>
            The site <strong>pixel-sans</strong> is an <strong>informational blog</strong> dedicated to publishing articles, analysis, and digital content. The information published is offered in a general and informative manner, without constituting professional, technical, or specialized advice.
          </p>

          <hr className="my-8" />

          <h2 className="text-2xl font-semibold mt-8 mb-4">3. Intellectual Property</h2>
          <p>
            Unless expressly stated otherwise, all texts and content on the blog are owned by <strong>pixel-sans</strong>.
          </p>
          <p>
            The site uses <strong>artificial intelligence</strong> tools for the generation of some articles. The thumbnails and images used may come from <strong>public YouTube video thumbnails</strong>, which are works of third parties and may be protected by copyright. Their use is solely for illustrative purposes.
          </p>
          <p>
            Total or partial reproduction of the contents is prohibited without prior authorization from the owner, respecting in all cases copyright and applicable licenses.
          </p>

          <hr className="my-8" />

          <h2 className="text-2xl font-semibold mt-8 mb-4">4. Third-Party Content and Comments</h2>
          <p>
            The site allows the publication of <strong>anonymous comments</strong>, under the sole responsibility of the person publishing them. <strong>pixel-sans</strong> is not responsible for content contributed by third parties.
          </p>
          <p>
            However, the owner reserves the right to <strong>moderate, edit, or delete</strong> comments that are offensive, illegal, defamatory, infringe on third-party rights, or violate the basic rules of coexistence of the site.
          </p>

          <hr className="my-8" />

          <h2 className="text-2xl font-semibold mt-8 mb-4">5. Links to Third Parties</h2>
          <p>
            The site may include links to external pages. <strong>pixel-sans</strong> does not control or guarantee the availability, legality, or accuracy of the content of such sites and assumes no responsibility for them.
          </p>

          <hr className="my-8" />

          <h2 className="text-2xl font-semibold mt-8 mb-4">6. Advertising and External Providers</h2>
          <p>
            The blog displays <strong>third-party advertising</strong> managed by the provider <strong>Monetag</strong>.<br />
            The ads are <strong>non-personalized</strong> and their content is the sole responsibility of the advertisers or third parties involved. <strong>pixel-sans</strong> does not necessarily endorse such products or services.
          </p>

          <hr className="my-8" />

          <h2 className="text-2xl font-semibold mt-8 mb-4">7. Limitation of Liability</h2>
          <p>
            Although efforts are made to maintain accurate and updated information, <strong>pixel-sans</strong> does not guarantee the absence of errors or the absolute accuracy of the content.
          </p>
          <p>The owner shall not be responsible for:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Damages derived from the use or inability to use the site.</li>
            <li>Losses derived from decisions made based on the published information.</li>
            <li>Technical failures, service interruptions, or other incidents inherent to hosting services or third parties.</li>
          </ul>
          <p>The use of the site is done under the sole responsibility of the user.</p>

          <hr className="my-8" />

          <h2 className="text-2xl font-semibold mt-8 mb-4">8. Data Protection</h2>
          <p>
            The processing of personal data —limited and minimal— is described in the <strong>Privacy Policy</strong>, available on the website.<br />
            To exercise rights of access, update, correction, or deletion, you can contact: 📧 <a href="mailto:contacto@pixel-sans.com" className="text-primary hover:underline">contacto@pixel-sans.com</a>.
          </p>

          <hr className="my-8" />

          <h2 className="text-2xl font-semibold mt-8 mb-4">9. Copyright Infringement Notifications</h2>
          <p>
            If you consider that any content on the site infringes intellectual property rights, you can send a notification to 📧 <a href="mailto:contacto@pixel-sans.com" className="text-primary hover:underline">contacto@pixel-sans.com</a> with the following information:
          </p>
          <ol className="list-decimal pl-6 mb-4">
            <li>Identification of the claimant and contact details.</li>
            <li>Clear description of the allegedly infringed work.</li>
            <li>URL or exact location of the content on the site.</li>
            <li>Proof or basis of ownership of the rights.</li>
            <li>Express request for removal or blocking of the content.</li>
          </ol>
          <p>
            Upon receiving the notification, the owner will evaluate the case and take the corresponding reasonable measures.
          </p>

          <hr className="my-8" />

          <h2 className="text-2xl font-semibold mt-8 mb-4">10. Applicable Law and Jurisdiction</h2>
          <p>
            This Legal Notice is governed by <strong>Colombian legislation</strong>.<br />
            For any dispute related to the use of the site, the parties submit to the jurisdiction of the <strong>competent courts and tribunals of Colombia</strong>.
          </p>

          <hr className="my-8" />

          <h2 className="text-2xl font-semibold mt-8 mb-4">11. Modifications</h2>
          <p>
            <strong>pixel-sans</strong> may update this Legal Notice at any time. The current version will always be the one published on this page.
          </p>

          <hr className="my-8" />

          <h2 className="text-2xl font-semibold mt-8 mb-4">12. Closing</h2>
          <p>
            Use of the site implies acceptance of this Legal Notice. We invite you to browse and participate in a respectful and responsible manner.
          </p>

          <hr className="my-8" />

          <p className="text-sm text-muted-foreground mt-8">Effective date: November 24, 2025</p>
        </div>
      </div>
    </div>
  );
};

export default LegalNotice;
