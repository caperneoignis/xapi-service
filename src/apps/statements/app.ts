/* tslint:disable:max-file-line-count */
import presenterFactory, { Result } from '@learninglocker/xapi-statements/dist/expressPresenter';
import repoFactory from '@learninglocker/xapi-statements/dist/repo/facade';
import serviceFactory from '@learninglocker/xapi-statements/dist/service';
import enTranslator from '@learninglocker/xapi-statements/dist/translatorFactory/en';
import AppConfig from './AppConfig';

export default (appConfig: AppConfig): Result => {
  const translator = enTranslator;
  const repo = repoFactory({
    auth: {
      facade: appConfig.repo.factory.authRepoName,
      fake: {},
      mongo: {
        db: appConfig.repo.mongo.db,
      },
    },
    events: {
      facade: appConfig.repo.factory.eventsRepoName,
      redis: {
        client: appConfig.repo.redis.client,
        prefix: appConfig.repo.redis.prefix,
      },
      sentinel: {
        client: appConfig.repo.sentinel.client,
        prefix: appConfig.repo.sentinel.prefix,
      },
    },
    models: {
      facade: appConfig.repo.factory.modelsRepoName,
      memory: {
        state: {
          fullActivities: [],
          statements: [],
        },
      },
      mongo: {
        db: appConfig.repo.mongo.db,
      },
    },
    storage: {
      facade: appConfig.repo.factory.storageRepoName,
      google: {
        bucketName: appConfig.repo.google.bucketName,
        keyFileName: appConfig.repo.google.keyFileName,
        projectId: appConfig.repo.google.projectId,
        subFolder: appConfig.repo.storageSubFolder,
      },
      local: {
        storageDir: `${appConfig.repo.local.storageDir}/${appConfig.repo.storageSubFolder}`,
      },
      s3: {
        awsConfig: appConfig.repo.s3.awsConfig,
        bucketName: appConfig.repo.s3.bucketName,
        subFolder: appConfig.repo.storageSubFolder,
      },
    },
  });
  const service = serviceFactory({
    awaitUpdates: appConfig.service.awaitUpdates,
    enableActivityUpdates: appConfig.service.enableActivityUpdates,
    enableAttachmentCreation: appConfig.service.enableAttachmentCreation,
    enableAttachmentValidation: appConfig.service.enableAttachmentValidation,
    enableConflictChecks: appConfig.service.enableConflictChecks,
    enableNullRemoval: appConfig.service.enableNullRemoval,
    enableReferencing: appConfig.service.enableReferencing,
    enableStatementCreation: appConfig.service.enableStatementCreation,
    enableVoiding: appConfig.service.enableVoiding,
    enableVoidingChecks: appConfig.service.enableVoidingChecks,
    logger: appConfig.logger,
    repo,
    tracker: appConfig.tracker,
  });
  const presenter = presenterFactory({
    allowFormBody: appConfig.presenter.express.allowFormBody,
    allowUndefinedMethod: appConfig.presenter.express.allowUndefinedMethod,
    bodyParserLimit: appConfig.presenter.express.bodyParserLimit,
    customRoute: 'xAPI/statements/status',
    customRouteText: 'ok',
    llClientInfoEndpoint: '',
    logger: appConfig.logger,
    morganDirectory: appConfig.presenter.express.morganDirectory,
    service,
    tracker: appConfig.tracker,
    translator,
  });
  return presenter;
};
