export default function Toolip() {
  return (
    <>
      <img
        src="/images/toolip.png"
        alt="Toolip team"
        className="w-full md:w-2/5 object-cover rounded-lg md:float-right md:ml-4 mb-4"
      />
      <p>
        I led a project called Toolip, putting digital tools at the service of
        non-profits.
      </p>
      <p>
        We automated processes for a food donation NGO in Madrid called De
        Familia a Familia. They calculated by hand where each volunteer had to
        go and what food they should bring. I used Google APIs to automate
        these processes and sync them to their existing infrastructure. We
        integrated this with a newly formatted sign-up service that saved the
        organization time and resources.
      </p>
      <p>
        We also helped automate processes for a student-led project in
        Barcelona helping young students find part-time jobs. It involved
        using Chromium and Azure to host an online WhatsApp bot which
        responded in real time to students and would update their database
        live to keep track of existing offers and current candidates.
      </p>
      <p>
        <a
          href="https://toolipweb.github.io/web/home.html"
          target="_blank"
          rel="noopener noreferrer"
          className="text-green-deep hover:underline">
          Learn more
        </a>
      </p>
    </>
  );
}
