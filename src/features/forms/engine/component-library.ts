import { fastQrComponent, fastQrComponentsDescriptions } from '@react-form-builder/components-fast-qr';
import { richTextComponent, richTextEditorComponentsDescriptions } from '@react-form-builder/components-rich-text';
import { signatureComponent, signatureComponentsDescriptions } from '@react-form-builder/components-signature';
import { printComponents, printComponentsDescriptions } from '@react-form-builder/components-print';
import { googleMapComponent, googleMapComponentsDescriptions } from '@react-form-builder/components-google-map';
import '@react-form-builder/components-rich-text/assets/styles.css';
import '@react-form-builder/components-signature/assets/styles.css';
import '@react-form-builder/components-print/assets/styles.css';
import '@react-form-builder/components-google-map/assets/styles.css';

/** Specialized controls use their vendor-neutral renderers; all standard controls are local shadcn-style components. */
export const libraryComponents = [
  ...printComponents,
  fastQrComponent,
  richTextComponent,
  signatureComponent,
  googleMapComponent,
].map(component => component.build());
export const libraryDescriptions = [fastQrComponentsDescriptions, richTextEditorComponentsDescriptions, signatureComponentsDescriptions, printComponentsDescriptions, googleMapComponentsDescriptions];
