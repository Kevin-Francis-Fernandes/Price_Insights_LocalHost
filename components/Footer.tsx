
import { FaFacebook, FaInstagram, FaGithub } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const Footer = () => {
    return (
        <footer className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
            <p className="flex lg:flex-1 text-gray-600">© 2024 PriceInsight Inc. All rights reserved.</p>
            <ul className="lg:flex lg:gap-x-12 lg:justify-end">
                <li><a target="_blank" href="https://www.facebook.com/AITDGOA/"><FaFacebook size={25}/></a></li>
                <li><a target="_blank" href="https://www.instagram.com/aitdgoa"><FaInstagram size={25}/></a></li>
                <li><a target="_blank" href="https://github.com/sharvilprabhudesai15"><FaGithub size={25} /></a></li>
                <li><a target="_blank" href="https://twitter.com/aitdgoa?lang=en"><FaXTwitter size={25}/></a></li>
            </ul>
        </footer>
    )
}

export default Footer;