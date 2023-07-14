import { Tree } from '@nx/devkit';
import { Schema } from '../schema';
import {
  generateFiles,
  joinPathFragments,
  logger,
  readProjectConfiguration,
  readNxJson,
  updateJson,
} from '@nx/devkit';
import { checkPathUnderFolder } from '../../utils/path';
import mergeDeep, { format } from '../../utils/string';
import { dasherize } from '@angular-devkit/core/src/utils/strings';
import componentGenerator from '../../component/component';
import { join } from 'path';
import { strings } from '@angular-devkit/core';
import { getStyleType } from '../../utils/project';
import featureGroupGenerator from '../../feature-group/feature-group';
import { exportInEntryPoint } from '../../utils/export';
import { getNpmScope } from '@nx/js/src/utils/package-json/get-npm-scope';

export async function generateAuthenticationTemplate(
  tree: Tree,
  options: Schema
) {
  await generateAssets(tree, options);
  await generateLocale(tree, options);
  await generateLayout(tree, options);
  await generateTemplate(tree, options);
}

async function generateAssets(tree: Tree, options: Schema) {
  const project = readNxJson(tree).defaultProject;
  const projectConfig = readProjectConfiguration(tree, project);
  const { sourceRoot } = projectConfig;

  generateFiles(
    tree,
    join(__dirname, '../files/authentication/assets'),
    join(sourceRoot, 'assets'),
    {
      tmpl: '',
      ...strings,
      ...options,
    }
  );
}

async function generateLocale(tree: Tree, options: Schema) {
  const project = readNxJson(tree).defaultProject;
  const projectConfig = readProjectConfiguration(tree, project);
  const { sourceRoot } = projectConfig;
  const localePath = join(sourceRoot, 'assets', 'locale');
  await updateJson(tree, join(localePath, 'vi.json'), (json) =>
    mergeDeep(json, {
      common: {
        form: {
          email: 'Email',
          password: 'Mật khẩu',
          verificationCode: 'Mã xác nhận',
          confirmPassword: 'Xác nhận mật khẩu',
        },
        action: {
          goBack: 'Quay lại',
        },
        validation: {
          required: 'Vui lòng nhập {{name}}',
          passwordStrength: 'Mật khẩu không đủ mạnh',
          matchPassword: 'Xác nhận mật khẩu không trùng khớp',
          unreadPolicy: 'Vui lòng chọn để tiếp tục',
        },
      },
      authentication: {
        layout: {
          welcome: 'Welcome to',
          site: 'Viettel Design System',
          copyright: 'Copyright 2021 Viettel Solutions, Inc.',
        },
        title: {
          signIn: 'Đăng nhập',
          signUp: 'Đăng ký',
          notification: 'Thông báo',
          forgot: 'Quên mật khẩu',
        },
        form: {
          forgotDesc: 'Nhập địa chỉ email',
          forgotLink: 'Quên mật khẩu?',
          forgotAction: 'Xác nhận',
          signUpDesc: 'Bạn chưa có tài khoản?',
          signUpLink: 'Đăng ký ngay',
          signUpAction: 'Đăng ký',
          signInDesc: 'Bạn đã có tài khoản?',
          signInLink: 'Đăng nhập ngay',
          signInAction: 'Đăng nhập',
          notificationDesc: 'Vui lòng kiểm tra email và kích hoạt tài khoản',
          retryDesc: 'Chưa nhận được email?',
          retryLink: 'Thử lại',
          returnAction: 'Quay lại đăng nhập',
          backAction: 'Quay lại',
          forgotLabel: 'Nhập địa chỉ email',
          policyDesc: 'Điều khoản sử dụng.',
          policySeeMore: 'Xem chi tiết',
          passwordDesc:
            'Mật khẩu tối thiểu 8 ký tự\nBao gồm: chữ thường, chữ hoa, số và ký tự đặc biệt.',
        },
      },
    })
  );
  await updateJson(tree, join(localePath, 'en.json'), (json) =>
    mergeDeep(json, {
      common: {
        form: {
          email: 'Email',
          password: 'Password',
          verificationCode: 'Verification Code',
          confirmPassword: 'Confirm Password',
        },
        action: {
          goBack: 'Back',
        },
        validation: {
          required: 'Please enter {{name}}',
          passwordStrength: 'Password is not strong enough',
          matchPassword: "Password doesn't match",
          unreadPolicy: 'Please tick to continue',
        },
      },
      authentication: {
        layout: {
          welcome: 'Welcome to',
          site: 'Viettel Design System',
          copyright: 'Copyright 2021 Viettel Solutions, Inc.',
        },
        title: {
          signIn: 'Sign in',
          signUp: 'Sign up',
          notification: 'Notification',
          forgot: 'Forgot Password',
        },
        form: {
          forgotDesc: 'Enter the registered email',
          forgotLink: 'Forgot password?',
          forgotAction: 'Submit',
          signUpDesc: 'Do you have an account?',
          signUpLink: 'Sign up now',
          signUpAction: 'Sign up',
          signInDesc: 'Already have an account?',
          signInLink: 'Sign in now',
          signInAction: 'Sign In',
          notificationDesc:
            'Please check your email registion and account activation before using',
          retryDesc: "Haven't received email yet?",
          retryLink: 'Retry',
          returnAction: 'Return to Login page',
          backAction: 'Back',
          forgotLabel: 'Enter the registered email',
          policyDesc: 'Agree to our terms of use.',
          policySeeMore: 'See Detail',
          passwordDesc:
            'Password should be at least 8 characters\nInclude: lower case letters, upper case letters, numbers and special characters.',
        },
      },
    })
  );
}

async function generateLayout(tree: Tree, options: Schema) {
  const style = getStyleType(tree);
  const npmScope = getNpmScope(tree);
  const { layoutName, name: rawName } = options;
  const name = dasherize(rawName);
  const formattedLayoutName = dasherize(format(layoutName, { name }));

  const layoutProjectConfig = readProjectConfiguration(tree, `layout-feature`);
  const { sourceRoot } = layoutProjectConfig;
  let pathToComponent = joinPathFragments(
    'lib',
    dasherize(formattedLayoutName)
  );
  if (checkPathUnderFolder(sourceRoot, pathToComponent)) {
    logger.warn(
      `NOTE: The path for layout (${pathToComponent}) is already exist under layout feature ${sourceRoot}.`
    );
    logger.warn(
      `It will be used as layout for template feature. If this is not what you want, kindly change "layout name" (current ${layoutName})`
    );
  } else {
    await componentGenerator(tree, {
      project: 'layout-feature',
      name: formattedLayoutName,
      path: sourceRoot,
      style,
    });

    generateFiles(
      tree,
      join(__dirname, '../files/authentication/layout/feature'),
      join(sourceRoot, pathToComponent),
      {
        tmpl: '',
        style,
        ...strings,
        ...options,
        layoutName: formattedLayoutName,
        npmScope,
      }
    );
  }
}

async function generateTemplate(tree: Tree, options: Schema) {
  const style = getStyleType(tree);
  const npmScope = getNpmScope(tree);
  const { layoutName, name: rawName } = options;
  const name = dasherize(rawName);
  const formattedLayoutName = dasherize(format(layoutName, { name }));

  await featureGroupGenerator(tree, {
    name,
  });

  const uiProjectConfig = readProjectConfiguration(tree, `${name}-ui`);
  const { sourceRoot: uiSourceRoot } = uiProjectConfig;

  const featureProjectConfig = readProjectConfiguration(
    tree,
    `${name}-feature`
  );
  const { sourceRoot: featureSourceRoot } = featureProjectConfig;

  // #region UI
  /**
   * Generate UI
   */
  generateFiles(
    tree,
    join(__dirname, '../files/authentication/ui'),
    join(uiSourceRoot, 'lib'),
    {
      tmpl: '',
      ...strings,
      ...options,
      layoutName: formattedLayoutName,
      name,
      style,
      npmScope,
    }
  );

  tree
    .children(join(uiSourceRoot, 'lib'))
    .filter((path) => !path.endsWith('.ts'))
    .forEach((path) => {
      exportInEntryPoint(tree, {
        project: `${name}-ui`,
        projectSourceRoot: uiSourceRoot,
        name: path,
        path: join(uiSourceRoot, 'lib'),
        type: 'component',
        flat: false,
      });
    });

  const shareUI = ['app-input'];
  shareUI.forEach((uiName) => {
    generateFiles(
      tree,
      join(__dirname, `../files/share-ui/${uiName}`),
      join(uiSourceRoot, 'lib', uiName),
      {
        tmpl: '',
        ...strings,
        ...options,
        layoutName: formattedLayoutName,
        name,
        style,
        npmScope,
      }
    );

    exportInEntryPoint(tree, {
      project: `${name}-ui`,
      projectSourceRoot: uiSourceRoot,
      name: uiName,
      path: join(uiSourceRoot, 'lib'),
      type: 'component',
      flat: false,
    });
  });
  // #endregion

  // #region Feature
  /**
   * Generate Feature
   */
  generateFiles(
    tree,
    join(__dirname, '../files/authentication/feature'),
    join(featureSourceRoot, 'lib'),
    {
      tmpl: '',
      ...strings,
      ...options,
      layoutName: formattedLayoutName,
      name,
      style,
      npmScope,
    }
  );

  //# endregion
}
