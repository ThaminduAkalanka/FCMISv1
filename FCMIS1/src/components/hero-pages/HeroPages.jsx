import { Link } from "react-router-dom";
import SecondaryHeading from "../headings/SecondaryHeading";


function HeroPages({ page }) {
  return (
    <section className="px-18 after:animate-float2 before:animate-float1 relative mt-[] bg-[url('./images/hero-pages/bg6.png')] bg-cover bg-right pb-20 pt-44 before:absolute before:left-[20%] before:top-5 before:z-10 before:h-28 before:w-28 before:bg-[url('')] before:bg-contain before:bg-bottom before:bg-no-repeat after:absolute after:bottom-0 after:left-[5%] after:z-10 after:h-28 after:w-28 after:bg-[url('')] after:bg-contain after:bg-bottom after:bg-no-repeat after:opacity-30">
      <div className="container">
        <h1 className="ml-8 text-4xl font-bold text-white">{page}</h1>
        <SecondaryHeading bgColor="black" uppercase={false}>
          <Link to="/member" className="focus text-red">
            Muscle Max
          </Link>
          
        </SecondaryHeading>
      </div>
    </section>
  );
}

export default HeroPages;
