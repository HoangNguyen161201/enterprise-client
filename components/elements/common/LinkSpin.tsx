import { GlobalContext } from 'contextApi/globalContext';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useContext } from 'react';

interface ILink {
  name: string;
  url: string;
  className?: string
}
export const LinkSpin = ({ name, url, className}: ILink) => {
  const { handleLoadPage } = useContext(GlobalContext);
  const router = useRouter()

  // loading page
  const redirectPage = () => {
    if (router.pathname != url) {
      handleLoadPage(true);
    }
  };

  return (
    <Link href={url as string}>
      <a className={className  || ''} onClick={() => redirectPage()}>{name}</a>
    </Link>
  );
};
