import {
  rSuiteComponents,
  rSuiteComponentsDescriptions,
} from '@react-form-builder/components-rsuite';
import {
  rSuiteTableComponents,
  rSuiteTableComponentsDescriptions,
} from '@react-form-builder/components-rsuite-table';
import {
  fastQrComponent,
  fastQrComponentsDescriptions,
} from '@react-form-builder/components-fast-qr';
import {
  richTextComponent,
  richTextEditorComponentsDescriptions,
} from '@react-form-builder/components-rich-text';
import {
  signatureComponent,
  signatureComponentsDescriptions,
} from '@react-form-builder/components-signature';
import { printComponents, printComponentsDescriptions } from '@react-form-builder/components-print';
import {
  googleMapComponent,
  googleMapComponentsDescriptions,
} from '@react-form-builder/components-google-map';
import '@react-form-builder/components-rsuite-table/assets/styles.css';
import '@react-form-builder/components-rich-text/assets/styles.css';
import '@react-form-builder/components-signature/assets/styles.css';
import '@react-form-builder/components-print/assets/styles.css';
import '@react-form-builder/components-google-map/assets/styles.css';

/** The centered RsModal adapter is registered separately under the native type. */
export const libraryComponents = [
  ...rSuiteComponents.filter((component) => component.getType() !== 'RsModal'),
  ...rSuiteTableComponents,
  ...printComponents,
  fastQrComponent,
  richTextComponent,
  signatureComponent,
  googleMapComponent,
].map((component) => component.build());

export const libraryDescriptions = [
  rSuiteComponentsDescriptions,
  rSuiteTableComponentsDescriptions,
  fastQrComponentsDescriptions,
  richTextEditorComponentsDescriptions,
  signatureComponentsDescriptions,
  printComponentsDescriptions,
  googleMapComponentsDescriptions,
];
