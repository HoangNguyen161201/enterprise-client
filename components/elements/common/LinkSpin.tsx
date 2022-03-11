import { GlobalContext } from 'contextApi/globalContext';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useContext } from 'react';

interface ILink {
  name: String;
  url: String;
}
export const LinkSpin = ({ name, url }: ILink) => {
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
      <a onClick={() => redirectPage()}>{name}</a>
    </Link>
  );
};
