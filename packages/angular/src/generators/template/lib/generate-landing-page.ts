import { Tree } from 'nx/src/generators/tree';
import { Schema } from '../schema';
import {
  generateFiles,
  joinPathFragments,
  logger,
  readProjectConfiguration,
  readWorkspaceConfiguration,
  updateJson,
} from '@nrwl/devkit';
import { checkPathUnderFolder } from '../../utils/path';
import mergeDeep, { format } from '../../utils/string';
import { dasherize } from '@angular-devkit/core/src/utils/strings';
import componentGenerator from '../../component/component';
import { join } from 'path';
import { strings } from '@angular-devkit/core';
import { getStyleType } from '../../utils/project';
import featureGroupGenerator from '../../feature-group/feature-group';
import { exportInEntryPoint } from '../../utils/export';

export async function generateLandingPageTemplate(tree: Tree, options: Schema) {
  await generateAssets(tree, options);
  await generateLocale(tree, options);
  await generateLayout(tree, options);
  await generateTemplate(tree, options);
}

async function generateAssets(tree: Tree, options: Schema) {
  const project = readWorkspaceConfiguration(tree).defaultProject;
  const projectConfig = readProjectConfiguration(tree, project);
  const { sourceRoot } = projectConfig;

  generateFiles(
    tree,
    join(__dirname, '../files/landing/assets'),
    join(sourceRoot, 'assets'),
    {
      tmpl: '',
      ...strings,
      ...options,
    }
  );
}

async function generateLocale(tree: Tree, options: Schema) {
  const project = readWorkspaceConfiguration(tree).defaultProject;
  const projectConfig = readProjectConfiguration(tree, project);
  const { sourceRoot } = projectConfig;
  const localePath = join(sourceRoot, 'assets', 'locale');
  await updateJson(tree, join(localePath, 'vi.json'), (json) =>
    mergeDeep(json, {
      common: {
        action: {
          signin: 'Đăng nhập',
        },
        form: {
          fullName: 'Họ tên',
          email: 'Email',
          phoneNumber: 'Số điện thoại',
        },
        other: {
          feature: 'Tính năng',
          support: 'Hỗ trợ',
          contact: 'Liên hệ',
          address: 'Địa chỉ',
          hotline: 'Hotline',
          email: 'Email',
          product: 'Sản phẩm',
          aboutUs: 'Về chúng tôi',
        },
        validation: {
          required: 'Vui lòng nhập {{name}}',
        },
      },
      landing: {
        layout: {
          learnMore: 'Tìm hiểu thêm về doanh nghiệp',
          checkOrder: 'Kiểm tra đơn hàng',
          servicePrice: 'Phí dịch vụ',
          contractConfirmation: 'Xác nhận hợp đồng',
          termOfUse: 'Điều khoản sử dụng',
          securityPolicy: 'Chính sách bảo mật',
          siteMap: 'SiteMap',
          companyName: 'Tổng Công ty Viễn thông Viettel (Viettel Telecom)',
          companyBranch: 'Chi nhánh Tập đoàn Công nghiệp - Viễn thông Quân đội',
          businessRegistrationNumber: 'Số ĐKKD',
          businessRegistrationNumberValue:
            '0100109106-011 do Sở Kế hoạch và Đầu tư Thành phố Hà Nội cấp lần đầu ngày 18/07/2005, sửa đổi lần thứ 15 ngày 18/12/2018',
          pricePolicy: 'Chính sách giá',
          paymentPolicy: 'Quy định về hình thức thanh toán',
          productIntro: 'Giới thiệu dịch vụ',
          operatingRegulation: 'Quy chế hoạt động',
        },
        homepage: {
          intro1: 'Hợp đồng điện tử Viettel',
          intro2: 'Không chỉ là ký số, mà còn hiệu quả - hợp pháp',
          intro3: 'Đăng ký dùng thử miễn phí',
          benefitPrepend1: 'Lợi ích cho doanh nghiệp',
          benefitTitle1: 'Đơn giản - Tiết kiệm - Tăng chất lượng dịch vụ',
          benefitDesc1:
            'Triển khai đơn giản - không cần đầu tư hạ tầng. Tiết kiệm thời gian - cắt giảm chi phí. Tăng sự hài lòng của khách hàng khi giao dịch với doanh nghiệp.',
          benefitTitle2: 'Bảo mật & An toàn nội dung',
          benefitDesc2:
            'Mọi hợp đồng đều được mã hóa nội dung trước khi lưu trữ. Cam kết toàn vẹn nội dung khi ký bằng OTP hoặc bút ký, đáp ứng yêu cầu của Pháp luật.',
          benefitTitle3: 'Ký số mọi lúc - mọi nơi',
          benefitDesc3:
            'Mọi hợp đồng đều được mã hóa nội dung trước khi lưu trữ. Cam kết toàn vẹn nội dung khi ký bằng OTP hoặc bút ký, đáp ứng yêu cầu của Pháp luật.',
          benefitTitle4: 'Đầy đủ tính pháp lý',
          benefitDesc4:
            'Hợp đồng được ký tuân thủ các quy định về hợp đồng, giao dịch điện tử và chữ ký số của Quốc Hội & Chính Phủ (Luật Dân Sự 2015, Luật Giao dịch điện tử 2005, Nghị định 52/2013/NĐ-CP, Nghị định 130/2018/NĐ-CP).',
          featurePrepend1: 'Tính năng của dịch vụ',
          featurePrepend2: 'Luồng ký kết đơn giản, xác thực hợp đồng dễ dàng',
          featureTitle1: 'Lập hợp đồng',
          featureTitle2: 'Giám đốc ký',
          featureTitle3: 'Khách hàng ký',
          featureTitle4: 'Hợp đồng hoàn thành',
          featureDesc4:
            'Hợp đồng được ký tuân thủ các quy định về hợp đồng, giao dịch điện tử và chữ ký số của Quốc Hội & Chính Phủ (Luật Dân Sự 2015, Luật Giao dịch điện tử 2005, Nghị định 52/2013/NĐ-CP, Nghị định 130/2018/NĐ-CP)',
          stepPrepend1:
            'Không cần đăng nhập, thực hiện xác thực hợp đồng bằng 3 bước',
          stepTitle1: '1. Upload hợp đồng',
          stepDesc1:
            'Chọn và tải file hợp đồng cần xác thực. Chúng tôi chỉ kiểm tra thông tin ký kết, không lưu lại hợp đồng',
          stepTitle2: '2. Chờ xử lý',
          stepDesc2:
            'Hệ thống lấy và kiểm tra thông tin ký kết của các bên trên hợp đồng có hợp lệ không.',
          stepTitle3: '3. Nhận thông tin',
          stepDesc3: 'Xem chi tiết thông tin xác thực hợp đồng đã upload.',
          commentPrepend1: 'Khách hàng của chúng tôi',
          commentPrepend2:
            'Nhiều người trong số họ được hỏi về mức độ hài lòng với dịch vụ của chúng tôi Và đây là câu trả lời của họ.',
          commentTitle1: 'Bà Lương Thị Huyền',
          commentSubTitle1: 'Giám đốc sản xuất Vinvoice',
          commentDesc1:
            'Áp dụng ký đồng điện tử, thời gian xử lý yêu cầu của khách hàng chỉ còn 4 giờ, giảm 70% thời gian chời đợi và xử lý so với trước đây.',
          commentTitle2: 'Ông Nguyễn Văn Đạt',
          commentSubTitle2: 'Giám đốc sản xuất Backendless',
          commentDesc2:
            'Hợp đồng được ký tuân thủ các quy định về hợp đồng, giao dịch điện tử và chữ ký số của Quốc Hội & Chính Phủ (Luật Dân Sự 2015, Luật Giao dịch điện tử 2005, Nghị định 52/2013/NĐ-CP, Nghị định 130/2018/NĐ-CP)',
          commentTitle3: 'Ông Nguyễn Văn A',
          commentSubTitle3: 'Kỹ sư sản phẩm Goggle',
          commentDesc3:
            'Hệ thống lấy và kiểm tra thông tin ký kết của các bên trên hợp đồng có hợp lệ không. Hệ thống lấy và kiểm tra thông tin ký kết của các bên trên hợp đồng có hợp lệ không. Hệ thống lấy và kiểm tra thông tin ký kết của các bên trên hợp đồng có hợp lệ không.',
          commentTitle4: 'Bà Trần Thị',
          commentSubTitle4: 'Chuyên viên bán hàng',
          commentDesc4:
            'Mọi hợp đồng đều được mã hóa nội dung trước khi lưu trữ. Cam kết toàn vẹn nội dung khi ký bằng OTP hoặc bút ký, đáp ứng yêu cầu của Pháp luật.',
          packagePrepend1: 'Lợi ích đăng ký gói',
          packagePrepend2:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Viverra habitant vitae enim amet purus rhoncus nisl neque ut. Quam fermentum in dignissim in vitae consectetur magna. In malesuada augue id sit cras commodo. Vulputate diam odio nibh suspendisse ut.',
          packageSubTitle1: '/ Mỗi tháng',
          packageTypeTitle1: 'Gói vĩnh viễn',
          packageSubTitle2: '/ Mỗi tháng',
          packageTypeTitle2: 'Gói tháng',
          packageSubTitle3: '/ Mỗi tháng',
          packageTypeTitle3: 'Gói năm',
          supportPrepend1:
            'Gọi cho chúng tôi để được tư vấn trực tiếp về sản phẩm',
          supportPrepend2: 'Trải nghiệm ngay — hoàn toàn miễn phí',
          supportPrepend3:
            'Tìm hiểu dịch vụ và trải nghiệm ký kết không giấy tờ ngay hôm nay.',
          supportSubmitText: 'Đăng ký dùng thử miễn phí',
        },
      },
    })
  );
  await updateJson(tree, join(localePath, 'en.json'), (json) =>
    mergeDeep(json, {
      common: {
        action: {
          signin: 'Sign in',
        },
        form: {
          fullName: 'Full name',
          email: 'Email',
          phoneNumber: 'Phone number',
        },
        other: {
          feature: 'Feature',
          support: 'Support',
          contact: 'Contact',
          address: 'Address',
          hotline: 'Hotline',
          email: 'Email',
          product: 'Product',
          aboutUs: 'About us',
        },
        validation: {
          required: 'Please enter {{name}}',
        },
      },
      landing: {
        layout: {
          learnMore: 'Learn more',
          checkOrder: 'Order',
          servicePrice: 'Service fee',
          contractConfirmation: 'Contract confirmation',
          termOfUse: 'Term of use',
          securityPolicy: 'Security policy',
          siteMap: 'SiteMap',
          companyName: 'Viettel Telecom Corporation (Viettel Telecom)',
          companyBranch:
            'Branch of Military Industry - Telecommunications Group',
          businessRegistrationNumber: 'Business registration number',
          businessRegistrationNumberValue:
            '0100109106-011 issued by Hanoi Department of Planning and Investment for the first time on July 18, 2005, amended for the 15th time on December 18, 2018',
          pricePolicy: 'Price policy',
          paymentPolicy: 'Payment policy',
          productIntro: 'Product introduction',
          operatingRegulation: 'Operating regulation',
        },
        homepage: {
          intro1: 'Viettel E-Contract',
          intro2: 'Not just digitally signed, but effective - legal',
          intro3: 'Sign up for a free trial',
          benefitPrepend1: 'Benefit for Bussiness',
          benefitTitle1: 'Simple - Saving - Increasing service quality',
          benefitDesc1:
            'Simple deployment - no infrastructure investment required. Save time - cut costs. Increase customer satisfaction when dealing with businesses.',
          benefitTitle2: 'Security & Content Safety',
          benefitDesc2:
            'All contracts are encrypted prior to storage. Commitment to content integrity when signing by OTP or pen, meeting the requirements of the Law.',
          benefitTitle3: 'Sign anytime - anywhere',
          benefitDesc3:
            'All contracts are encrypted prior to storage. Commitment to content integrity when signing by OTP or pen, meeting the requirements of the Law.',
          benefitTitle4: 'Full legality',
          benefitDesc4:
            'The signed contract complies with the regulations on contracts, electronic transactions and digital signatures of the National Assembly & Government (Civil Law 2015, Law on Electronic Transactions 2005, Decree 52/2013/ND-CP, Decree 130/2018/ND-CP).',
          featurePrepend1: 'Service feature',
          featurePrepend2: 'Simple signing flow, easy contract validation',
          featureTitle1: 'Create contract',
          featureTitle2: 'Manage sign',
          featureTitle3: 'Customer sign',
          featureTitle4: 'Completed contract',
          featureDesc4:
            'The signed contract complies with the regulations on contracts, electronic transactions and digital signatures of the National Assembly & Government (Civil Law 2015, Law on Electronic Transactions 2005, Decree 52/2013/ND-CP, Decree 130/2018/ND-CP)',
          stepPrepend1:
            'No need to log in, perform contract authentication in 3 steps',
          stepTitle1: '1. Upload contract',
          stepDesc1:
            'Select and download the contract file to be verified. We only check the signed information, not save the contract',
          stepTitle2: '2. Wait for processing',
          stepDesc2:
            'The system retrieves and checks whether the signed information of the parties on the contract is valid.',
          stepTitle3: '3. Get information',
          stepDesc3:
            'View details of uploaded contract validation information.',
          commentPrepend1: 'Our customer',
          commentPrepend2:
            'Many of them are asked about their satisfaction with our service And here are their answers.',
          commentTitle1: 'Mrs Lương Thị Huyền',
          commentSubTitle1: 'Vinvoice Production Manager',
          commentDesc1:
            "Applying e-signing, the processing time for customers' requests is only 4 hours, reducing the waiting and processing time by 70% compared to before.",
          commentTitle2: 'Mr Nguyễn Văn Đạt',
          commentSubTitle2: 'Backendless Production Manager',
          commentDesc2:
            'The signed contract complies with the regulations on contracts, electronic transactions and digital signatures of the National Assembly & Government (Civil Law 2015, Law on Electronic Transactions 2005, Decree 52/2013/ND-CP, Decree 130/2018/ND-CP)',
          commentTitle3: 'Mr Nguyễn Văn A',
          commentSubTitle3: 'Google product engineer',
          commentDesc3:
            'The system retrieves and checks whether the signed information of the parties on the contract is valid. The system retrieves and checks whether the signed information of the parties on the contract is valid. The system retrieves and checks whether the signed information of the parties on the contract is valid.',
          commentTitle4: 'Mrs Trần Thị',
          commentSubTitle4: 'Sales specialist',
          commentDesc4:
            'All contracts are encrypted prior to storage. Commitment to content integrity when signing by OTP or pen, meeting the requirements of the Law.',
          packagePrepend1: 'Package benefit',
          packagePrepend2:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Viverra habitant vitae enim amet purus rhoncus nisl neque ut. Quam fermentum in dignissim in vitae consectetur magna. In malesuada augue id sit cras commodo. Vulputate diam odio nibh suspendisse ut.',
          packageSubTitle1: '/ Per month',
          packageTypeTitle1: 'Lifetime',
          packageSubTitle2: '/ Per month',
          packageTypeTitle2: 'Monthly',
          packageSubTitle3: '/ Per month',
          packageTypeTitle3: 'Yearly',
          supportPrepend1: 'Call us for direct product consultation',
          supportPrepend2: "Try it now — it's free",
          supportPrepend3:
            'Learn about the paperless signing service and experience today.',
          supportSubmitText: 'Sign up for a free trial',
        },
      },
    })
  );
}

async function generateLayout(tree: Tree, options: Schema) {
  const style = getStyleType(tree);
  const { npmScope } = readWorkspaceConfiguration(tree);
  const { layoutName, name: rawName } = options;
  const name = dasherize(rawName);
  const formattedLayoutName = dasherize(format(layoutName, { name }));

  const layoutFeatureProjectConfig = readProjectConfiguration(
    tree,
    `layout-feature`
  );

  const uiProjectConfig = readProjectConfiguration(tree, `layout-ui`);
  const { sourceRoot: featureSourceRoot } = layoutFeatureProjectConfig;
  const { sourceRoot: uiSourceRoot } = uiProjectConfig;

  let pathToComponent = joinPathFragments(
    'lib',
    dasherize(formattedLayoutName)
  );
  if (checkPathUnderFolder(featureSourceRoot, pathToComponent)) {
    logger.warn(
      `NOTE: The path for layout (${pathToComponent}) is already exist under layout feature ${featureSourceRoot}.`
    );
    logger.warn(
      `It will be used as layout for template feature. If this is not what you want, kindly change "layout name" (current ${layoutName})`
    );
  } else {
    await componentGenerator(tree, {
      project: 'layout-feature',
      name: formattedLayoutName,
      path: featureSourceRoot,
      style,
    });

    generateFiles(
      tree,
      join(__dirname, '../files/landing/layout/feature'),
      join(featureSourceRoot, pathToComponent),
      {
        tmpl: '',
        style,
        ...strings,
        ...options,
        layoutName: formattedLayoutName,
        npmScope,
      }
    );

    generateFiles(
      tree,
      join(__dirname, '../files/landing/layout/ui'),
      join(uiSourceRoot, 'lib'),
      {
        tmpl: '',
        style,
        ...strings,
        ...options,
        layoutName: formattedLayoutName,
        npmScope,
      }
    );

    tree
      .children(join(uiSourceRoot, 'lib'))
      .filter((path) => !path.endsWith('.ts'))
      .forEach((path) => {
        exportInEntryPoint(tree, {
          project: `layout-ui`,
          projectSourceRoot: uiSourceRoot,
          name: path,
          path: join(uiSourceRoot, 'lib'),
          type: 'component',
          flat: false,
        });
      });
  }
}

async function generateTemplate(tree: Tree, options: Schema) {
  const style = getStyleType(tree);
  const { npmScope } = readWorkspaceConfiguration(tree);
  const { layoutName, name: rawName } = options;
  const name = dasherize(rawName);
  const formattedLayoutName = format(layoutName, { name });

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
    join(__dirname, '../files/landing/ui'),
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
    join(__dirname, '../files/landing/feature'),
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
