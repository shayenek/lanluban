import { currentUser } from '@clerk/nextjs/server';
import { getTranslations } from 'next-intl/server';

import { supabase } from '@/utils/SupabaseClient';

export const Hello = async () => {
  const t = await getTranslations('Dashboard');
  const user = await currentUser();

  const { data: users, error } = await supabase.from('users').select('*');
  if (error) {
    console.error('Error fetching users:', error);
    return <p>Error loading users.</p>;
  }
  return (
    <>
      <p>
        {`👋 `}
        {t('hello_message', { email: user?.emailAddresses[0]?.emailAddress })}
      </p>
      <p>
        {users.map((user) => (
          <div key={user.id}>
            {user.name}
          </div>
        ))}
      </p>
    </>
  );
};
