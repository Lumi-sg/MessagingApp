import "./footer.css";
const Footer = () => {
	return (
		<footer className="footer">
			<p>
				Built by Lumi&nbsp;&nbsp;&nbsp;
				<a
					href="https://github.com/Lumi-sg/MessagingApp"
					style={{ textDecoration: "none" }}
					target="_blank"
					rel="noopener noreferrer"
				>
					<i style={{ fontSize: 24 }} className="fa">
						&#xf09b;
					</i>
				</a>
			</p>
		</footer>
	);
};

export default Footer;
