import Seo from '../components/Seo';
import seoData from '../next-seo.config';
import { useEffect, useState } from "react";
import { Gallery } from "react-grid-gallery";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";

export default function WeddingPhotos() {
	const page = {
		title: seoData.openGraph.title,
		excerpt: 'home',
		slug: '/',
		coverImage: 'https://vjy.me/preview.jpg'
	};

	const [images, setImages] = useState([]);
	const [index, setIndex] = useState(-1);

	const currentImage = images[index];
	const nextIndex = (index + 1) % images.length;
	const nextImage = images[nextIndex] || currentImage;
	const prevIndex = (index + images.length - 1) % images.length;
	const prevImage = images[prevIndex] || currentImage;

	const handleClick = (index, item) => setIndex(index);
	const handleClose = () => setIndex(-1);
	const handleMovePrev = () => setIndex(prevIndex);
	const handleMoveNext = () => setIndex(nextIndex);
	const [loading, setLoading] = useState(false);

	const getImgDimensions = async (img) => {
		return new Promise((resolve, reject) => {
			const newImg = new Image();
			let [h, w] = [0, 0];

			newImg.onload = function () {
				h = newImg.height;
				w = newImg.width;

				resolve({
					height: h,
					width: w
				});
			}

			newImg.src = img.src;
		});
	};

	useEffect(() => {
		fetch('/api/meet-bride-groom')
			.then(async (resp) => {
				const imgResp = await resp.json();

				const imgData = await Promise.all(
					imgResp.data.map(async (i) => {
						const dim = await getImgDimensions(i);

						return {
							...i,
							width: dim.width,
							height: dim.height
						}
					})
				);

				setImages(imgData);
			}).catch((e) => {
				console.log(e);
				alert('Could not load images, try again later!');
			});
	}, []);

	if (!images.length) {
		return <>No Images to show, try later</>;
	}

	return (
		<>
			<Seo page={page} />
			<div>
				<Gallery
					images={images}
					onClick={handleClick}
					enableImageSelection={false}
				/>
				{!!currentImage && (
					<Lightbox
						mainSrc={currentImage.original}
						imageTitle={currentImage.caption}
						mainSrcThumbnail={currentImage.src}
						nextSrc={nextImage.original}
						nextSrcThumbnail={nextImage.src}
						prevSrc={prevImage.original}
						prevSrcThumbnail={prevImage.src}
						onCloseRequest={handleClose}
						onMovePrevRequest={handleMovePrev}
						onMoveNextRequest={handleMoveNext}
					/>
				)}
			</div>
		</>
	)
}

