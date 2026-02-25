# Деплой на GitHub Pages

## Ошибка 404 при деплое

Если в логе видно:

- `Failed to create deployment (status: 404)`
- `HttpError: Not Found`
- `Ensure GitHub Pages has been enabled`

значит **GitHub Pages в репозитории ещё не включён**. Это делается один раз в настройках репозитория.

## Что сделать один раз

1. Откройте настройки репозитория:
   - **https://github.com/AlekseyShlykov/hobby/settings/pages**  
   (или замените `AlekseyShlykov/hobby` на ваш `owner/repo`)

2. В блоке **Build and deployment**:
   - **Source** выберите **GitHub Actions** (не Branch, не Deploy from a branch).

3. Сохраните. После этого при следующем пуше в `main` workflow «Deploy to GitHub Pages» должен успешно задеплоить сайт.

## Где будет сайт

После успешного деплоя:

- **Организация/юзер**: `https://<user>.github.io/<repo>/`
- Для репозитория `AlekseyShlykov/hobby`: `https://alekseyshlykov.github.io/hobby/`

## Аннотации «3 errors»

Если в разделе **Annotations** в GitHub Actions показываются ошибки вместе с падением деплоя (404), это, как правило, те же ошибки деплоя (action создаёт несколько аннотаций). После включения GitHub Actions в качестве источника Pages и успешного деплоя эти аннотации должны исчезнуть.

Если аннотации остаются после успешного деплоя — пришлите их текст или скрин, чтобы можно было разобрать по шагам.
