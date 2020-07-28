import { CSSType, Color, ImageAsset, ImageSource, Property, Utils, View } from '@nativescript/core';
import { cssProperty } from '@nativescript-community/ui-material-core';

export const imageSourceProperty = new Property<FloatingActionButtonBase, ImageSource>({ name: 'imageSource' });

export const srcProperty = new Property<FloatingActionButtonBase, any>({
    name: 'src',
});

export const sizeProperty = new Property<FloatingActionButtonBase, string>({
    name: 'size',
    affectsLayout: true,
});

export const expandedProperty = new Property<FloatingActionButtonBase, boolean>({
    name: 'expanded',
    affectsLayout: true,
});

@CSSType('MDFloatingActionButton')
export abstract class FloatingActionButtonBase extends View {
    constructor() {
        super();
        // we need to set the default through css or user would not be able to overload it through css...
        this.style['css:margin-left'] = 4;
        this.style['css:margin-right'] = 4;
        this.style['css:margin-top'] = 11;
        this.style['css:margin-bottom'] = 16;
    }
    @cssProperty elevation: number;
    @cssProperty color: Color;
    @cssProperty dynamicElevationOffset: number;

    public srcCompat: string;
    public fabSize: string;
    public fabCustomSize: number;
    public imageSource: ImageSource;
    public src: string | ImageSource;
    public isLoading: boolean;
    public size: 'mini' | 'auto' | 'normal';

    /**
     * @internal //copied from image common
     */
    protected _createImageSourceFromSrc(value: string | ImageSource | ImageAsset): void {
        const originalValue = value;
        if (typeof value === 'string' || value instanceof String) {
            value = value.trim();
            this.imageSource = null;
            this['_url'] = value;

            this.isLoading = true;

            const source = new ImageSource();
            const imageLoaded = () => {
                const currentValue = this.src;
                if (currentValue !== originalValue) {
                    return;
                }
                this.imageSource = source;
                this.isLoading = false;
            };

            if (Utils.isDataURI(value)) {
                const base64Data = value.split(',')[1];
                if (base64Data !== undefined) {
                    // if (sync) {
                    source.loadFromBase64(base64Data);
                    imageLoaded();
                    // } else {
                    //     source.fromBase64(base64Data).then(imageLoaded);
                    // }
                }
            } else if (Utils.isFileOrResourcePath(value)) {
                if (value.indexOf(Utils.RESOURCE_PREFIX) === 0) {
                    const resPath = value.substr(Utils.RESOURCE_PREFIX.length);
                    // if (sync) {
                    source.loadFromResource(resPath);
                    imageLoaded();
                    // } else {
                    //     this.imageSource = null;
                    //     source.fromResource(resPath).then(imageLoaded);
                    // }
                } else {
                    // if (sync) {
                    source.loadFromFile(value);
                    imageLoaded();
                    // } else {
                    //     this.imageSource = null;
                    //     source.fromFile(value).then(imageLoaded);
                    // }
                }
            } else {
                this.imageSource = null;
                ImageSource.fromUrl(value).then((r) => {
                    if (this['_url'] === value) {
                        this.imageSource = r;
                        this.isLoading = false;
                    }
                });
            }
        } else if (value instanceof ImageSource) {
            // Support binding the imageSource trough the src property
            this.imageSource = value;
            this.isLoading = false;
        } else if (value instanceof ImageAsset) {
            ImageSource.fromAsset(value).then((result) => {
                this.imageSource = result;
                this.isLoading = false;
            });
        } else {
            this.imageSource = new ImageSource(value);
            this.isLoading = false;
        }
    }
}
imageSourceProperty.register(FloatingActionButtonBase);
srcProperty.register(FloatingActionButtonBase);
sizeProperty.register(FloatingActionButtonBase);
expandedProperty.register(FloatingActionButtonBase);
