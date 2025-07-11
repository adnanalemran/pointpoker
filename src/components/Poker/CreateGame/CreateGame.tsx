import React, { FormEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { animals, colors, Config, starWars, uniqueNamesGenerator } from 'unique-names-generator';
import { addNewGame } from '../../../service/games';
import { GameType, NewGame } from '../../../types/game';
import { getCards, getCustomCards } from '../../Players/CardPicker/CardConfigs';

const gameNameConfig: Config = {
  dictionaries: [colors, animals],
  separator: ' ',
  style: 'capital',
};
const userNameConfig: Config = {
  dictionaries: [starWars],
};

export const CreateGame = () => {
  const history = useHistory();
  const [gameName, setGameName] = useState(uniqueNamesGenerator(gameNameConfig));
  const [createdBy, setCreatedBy] = useState(
    localStorage.getItem('recentPlayerName') || uniqueNamesGenerator(userNameConfig),
  );
  const [gameType, setGameType] = useState(GameType.Fibonacci);
  const [hasDefaults, setHasDefaults] = useState({ game: true, name: true });
  const [loading, setLoading] = useState(false);
  const [allowMembersToManageSession, setAllowMembersToManageSession] = useState(false);
  const [customOptions, setCustomOptions] = React.useState(Array(15).fill(''));
  const [error, setError] = React.useState(false);
  const { t } = useTranslation();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (gameType === GameType.Custom) {
      const count = customOptions.reduce(
        (acc, option) => (option && option.trim() !== '' ? acc + 1 : acc),
        0,
      );
      setError(count < 2);
      if (count < 2) {
        return;
      }
    }
    setLoading(true);
    const game: NewGame = {
      name: gameName,
      createdBy: createdBy,
      gameType: gameType,
      isAllowMembersToManageSession: allowMembersToManageSession,
      cards: gameType === GameType.Custom ? getCustomCards(customOptions) : getCards(gameType),
      createdAt: new Date(),
    };
    const newGameId = await addNewGame(game);
    if (newGameId) {
      localStorage.setItem('recentPlayerName', createdBy);
      setLoading(false);
    }
    history.push(`/game/${newGameId}`);
  };

  const handleCustomOptionChange = (index: number, value: string) => {
    const newCustomOptions = [...customOptions];
    newCustomOptions[index] = value;
    setCustomOptions(newCustomOptions);
  };

  const emptyGameName = () => {
    if (hasDefaults.game) {
      setGameName('');
      hasDefaults.game = false;
      setHasDefaults({ ...hasDefaults });
    }
  };
  const emptyCreatorName = () => {
    if (hasDefaults.name) {
      setCreatedBy('');
      hasDefaults.name = false;
      setHasDefaults({ ...hasDefaults });
    }
  };

  return (
    <form onSubmit={handleSubmit} className='w-full flex justify-center'>
      <div className='w-full max-w-lg modern-card rounded-2xl shadow-2xl p-8 mt-6 animate-slide-in-up'>
        <h2 className='text-3xl font-bold mb-6 text-center gradient-text'>
          {t('CreateGame.newSessionHeader')}
        </h2>
        <div className='flex flex-col gap-6'>
          <div>
            <label className='block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300'>
              {t('CreateGame.sessionNameLabel')}
            </label>
            <input
              required
              type='text'
              className='w-full modern-input'
              placeholder='Enter a session name'
              value={gameName || ''}
              onClick={emptyGameName}
              onChange={(event) => setGameName(event.target.value)}
            />
          </div>
          <div>
            <label className='block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300'>
              {t('CreateGame.yourNameLabel')}
            </label>
            <input
              required
              type='text'
              className='w-full modern-input'
              placeholder='Enter your name'
              value={createdBy || ''}
              onClick={emptyCreatorName}
              onChange={(event) => setCreatedBy(event.target.value)}
            />
          </div>
          <fieldset>
            <legend className='block text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300'>
              {t('CreateGame.sessionSizingType')}
            </legend>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
              {[
                { type: GameType.Fibonacci, label: t('CreateGame.fibonacci') },
                { type: GameType.ShortFibonacci, label: t('CreateGame.shortFibonacci') },
                { type: GameType.TShirt, label: t('CreateGame.tShirt') },
                { type: GameType.TShirtAndNumber, label: t('CreateGame.tShirtAndNumber') },
                { type: GameType.Custom, label: t('CreateGame.custom') },
              ].map(({ type, label }) => (
                <label key={type} className='flex items-center p-3 rounded-lg border-2 border-transparent hover:border-blue-300 dark:hover:border-blue-600 transition-all cursor-pointer bg-gray-50 dark:bg-gray-800'>
                  <input
                    type='radio'
                    className='form-radio text-blue-600 focus:ring-blue-500'
                    name='gameType'
                    value={type}
                    checked={gameType === type}
                    onChange={() => setGameType(type)}
                  />
                  <span className='ml-3 font-medium'>{label}</span>
                </label>
              ))}
            </div>
          </fieldset>
          {gameType === GameType.Custom && (
            <>
              <div className='bg-gray-50 dark:bg-gray-800 p-4 rounded-lg'>
                <label className='block text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300'>
                  Custom Values
                </label>
                <div className='grid grid-cols-5 gap-2'>
                  {customOptions.map((option: any, index: number) => (
                    <input
                      key={index}
                      type='text'
                      maxLength={3}
                      className='w-full border-2 border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700'
                      value={option}
                      onChange={(event) => handleCustomOptionChange(index, event.target.value)}
                      data-testid={`custom-option-${index}`}
                      placeholder='?'
                    />
                  ))}
                </div>
                {error && (
                  <p className='text-red-600 text-sm mt-2 font-medium'>{t('CreateGame.pleaseEnterValues')}</p>
                )}
              </div>
            </>
          )}
          <label className='flex items-center p-3 rounded-lg border-2 border-transparent hover:border-blue-300 dark:hover:border-blue-600 transition-all cursor-pointer bg-gray-50 dark:bg-gray-800'>
            <input
              type='checkbox'
              className='form-checkbox text-blue-600 focus:ring-blue-500'
              checked={allowMembersToManageSession}
              onChange={() => setAllowMembersToManageSession(!allowMembersToManageSession)}
            />
            <span className='ml-3 font-medium'>{t('CreateGame.allowMembersToManageSession')}</span>
          </label>
        </div>
        <div className='flex justify-center mt-8'>
          <button
            type='submit'
            className={`btn-primary text-lg px-8 py-3 ${
              loading ? 'opacity-50 cursor-not-allowed' : 'animate-pulse-glow'
            }`}
            disabled={loading}
            data-testid='loading'
          >
            {loading ? (
              <span className='flex items-center'>
                <svg className='animate-spin -ml-1 mr-3 h-5 w-5 text-white' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                  <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                  <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                </svg>
                {t('CreateGame.creating')}
              </span>
            ) : (
              t('CreateGame.create')
            )}
          </button>
        </div>
      </div>
    </form>
  );
};
