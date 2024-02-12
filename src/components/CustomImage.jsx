import Image from 'next/image';

export default function CustomImage(props) {
  const basePath = '/dev-blog/';
  console.log('basePath', basePath);
  console.log('props.src', props.src);
  const imageSrc = `${basePath}${props.src}`;
  console.log('imageSrc', imageSrc);

  return (
    <Image
      alt={props.alt}
      src={imageSrc}
      width={props.width}
      height={props.height}
      className={props.className}
    />
  );
}
