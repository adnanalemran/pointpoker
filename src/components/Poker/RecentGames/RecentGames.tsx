import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { AlertDialog } from '../../../components/AlertDialog/AlertDialog';
import { removeGame } from '../../../service/games';
import { getCurrentPlayerId, getPlayerRecentGames } from '../../../service/players';
import { PlayerGame } from '../../../types/player';
import { isModerator } from '../../../utils/isModerator';
import { DeleteSVG } from '../../SVGs/DeleteSVG';

export const RecentGames = () => {
  const history = useHistory();
  const [recentGames, setRecentGames] = useState<PlayerGame[] | undefined>(undefined);
  const [reloadRecent, setReloadRecent] = useState<Boolean>(false);

  useEffect(() => {
    let fetchCleanup = true;

    async function fetchRecent() {
      const games = await getPlayerRecentGames();
      if (games && fetchCleanup) {
        setRecentGames(games);
      }
    }

    fetchRecent();

    return () => {
      fetchCleanup = false;
    };
  }, [reloadRecent]);

  const isEmptyRecentGames = (): boolean => {
    if (!recentGames) {
      return true;
    }
    if (recentGames && recentGames.length === 0) {
      return true;
    }
    return false;
  };

  const handleRemoveGame = async (recentGameId: string) => {
    await removeGame(recentGameId);
    setReloadRecent(!reloadRecent);
  };

  return (
    <div className='modern-card rounded-2xl shadow-2xl overflow-hidden'>
      <div className='text-center -mt-5 mx-auto w-[95%] border-2 bg-white dark:bg-gray-800 border-purple-300 dark:border-purple-600 rounded-2xl flex items-center justify-center px-4 py-2 shadow-lg'>
        <h6 className='text-lg font-bold gradient-text truncate'>Recent Sessions</h6>
      </div>
      <div className='p-6'>
        {isEmptyRecentGames() && (
          <div className='text-center py-8'>
            <div className='text-gray-400 dark:text-gray-500 text-6xl mb-4'>📋</div>
            <p className='text-gray-500 dark:text-gray-400 font-medium'>No recent sessions found</p>
            <p className='text-sm text-gray-400 dark:text-gray-500 mt-2'>Create a new session to get started!</p>
          </div>
        )}
        {recentGames && recentGames.length > 0 && (
          <div className='overflow-x-auto' style={{ maxHeight: 300 }}>
            <table className='min-w-full divide-y divide-gray-200 dark:divide-gray-700'>
              <thead className='bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20'>
                <tr>
                  <th className='sticky top-0 z-10 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 px-6 py-4 text-left text-xs font-bold tracking-wider text-purple-700 dark:text-purple-300'>
                    Session Name
                  </th>
                  <th className='sticky top-0 z-10 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 px-6 py-4 text-left text-xs font-bold tracking-wider text-purple-700 dark:text-purple-300'>
                    Created By
                  </th>
                  <th className='sticky top-0 z-10 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 px-6 py-4 text-left text-xs font-medium tracking-wider'></th>
                </tr>
              </thead>
              <tbody className='bg-white/50 dark:bg-gray-800/50'>
                {recentGames.map(
                  (recentGame) =>
                    recentGame.name && (
                      <tr
                        key={recentGame.id}
                        className='hover:bg-purple-50 dark:hover:bg-purple-900/20 cursor-pointer border-t border-gray-200 dark:border-gray-700 transition-colors duration-200'
                        onClick={() => history.push(`/game/${recentGame.id}`)}
                      >
                        <td className='px-6 py-4 text-sm font-medium text-gray-700 dark:text-gray-300'>{recentGame.name}</td>
                        <td className='px-6 py-4 text-sm text-gray-600 dark:text-gray-400'>{recentGame.createdBy}</td>
                        {isModerator(
                          recentGame.createdById,
                          getCurrentPlayerId(recentGame.id),
                          recentGame.isAllowMembersToManageSession,
                        ) ? (
                          <td
                            className='px-6 py-4 whitespace-nowrap text-sm'
                            onClick={(e) => e.stopPropagation()}
                          >
                            <AlertDialog
                              id={recentGame.id}
                              message={`Are you sure? That will delete the session: ${recentGame.name} and remove all players from the session.`}
                              onConfirm={(id: string) => handleRemoveGame(id)}
                            >
                              <DeleteSVG className='h-5 w-5 text-red-500 hover:text-red-700 transition-colors' />
                            </AlertDialog>
                          </td>
                        ) : (
                          <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'></td>
                        )}
                      </tr>
                    ),
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
