import { BaseTemplate } from '@/templates/BaseTemplate';
import { SignOutButton } from '@clerk/nextjs';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';

export default async function DashboardLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  const t = await getTranslations({
    locale,
    namespace: 'DashboardLayout',
  });

  return (
    <BaseTemplate
      leftNav={(
        <>
          <li>
            <Link
              href="/match/create/"
              className="border-none text-gray-700 hover:text-gray-900"
            >
              Dodaj mecz
            </Link>
          </li>
          <li>
            <Link
              href="/match/add-stats/"
              className="border-none text-gray-700 hover:text-gray-900"
            >
              Dodaj staty
            </Link>
          </li>
          <li>
            <Link
              href="/match/list/"
              className="border-none text-gray-700 hover:text-gray-900"
            >
              Mecze
            </Link>
          </li>
          <li>
            <Link
              href="/match/player-list/"
              className="border-none text-gray-700 hover:text-gray-900"
            >
              Gracze
            </Link>
          </li>
        </>
      )}
      rightNav={(
        <>
          <li>
            <SignOutButton>
              <button className="border-none text-gray-700 hover:text-gray-900" type="button">
                {t('sign_out')}
              </button>
            </SignOutButton>
          </li>
        </>
      )}
    >
      {props.children}
    </BaseTemplate>
  );
}
