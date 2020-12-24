/* eslint-disable max-len */
import React, { Component } from 'react';
import { ActivityIndicatorProps, ActivityIndicator, StyleSheet, LayoutChangeEvent, Animated, StyleProp, ViewStyle } from 'react-native';
import Spinner, { SpinnerProps } from 'react-native-loading-spinner-overlay';
import { withTheme, ThemeProps } from 'react-native-elements';
import i18next from 'i18next';
import LottieView from 'lottie-react-native';
import { AnimatedLottieLoading } from '@assets/animations';

type ColorFilter = {
  keypath: string;
  color: string;
};

interface AnimationObject {
  v: string;
  fr: number;
  ip: number;
  op: number;
  w: number;
  h: number;
  nm: string;
  ddd: number;
  assets: any[];
  layers: any[];
}

export interface AnimatedLottieViewProps {
  /**
   * The source of animation. Can be referenced as a local asset by a string, or remotely
   * with an object with a `uri` property, or it can be an actual JS object of an
   * animation, obtained (for example) with something like
   * `require('../path/to/animation.json')`
   */
  source?: string | AnimationObject | { uri: string };

  /**
   * A number between 0 and 1, or an `Animated` number between 0 and 1. This number
   * represents the normalized progress of the animation. If you update this prop, the
   * animation will correspondingly update to the frame at that progress value. This
   * prop is not required if you are using the imperative API.
   */
  progress?: number | Animated.Value | Animated.AnimatedInterpolation;

  /**
   * The speed the animation will progress. This only affects the imperative API. The
   * default value is 1.
   */
  speed?: number;

  /**
   * The duration of the animation in ms. Takes precedence over speed when set.
   * This only works when source is an actual JS object of an animation.
   */
  duration?: number;

  /**
   * A boolean flag indicating whether or not the animation should loop.
   */
  loop?: boolean;

  /**
   * Style attributes for the view, as expected in a standard `View`:
   * http://facebook.github.io/react-native/releases/0.39/docs/view.html#style
   * CAVEAT: border styling is not supported.
   */
  style?: StyleProp<ViewStyle>;

  /**
   * [Android] Relative folder inside of assets containing image files to be animated.
   * Make sure that the images that bodymovin export are in that folder with their names unchanged (should be img_#).
   * Refer to https://github.com/airbnb/lottie-android#image-support for more details.
   * @platform android
   */
  imageAssetsFolder?: string;

  /**
   * [Android]. Uses hardware acceleration to perform the animation. This should only
   * be used for animations where your width and height are equal to the composition width
   * and height, e.g. you are not scaling the animation.
   * @platform android
   */
  hardwareAccelerationAndroid?: boolean;

  /**
   * Determines how to resize the animated view when the frame doesn't match the raw image
   * dimensions.
   * Refer to https://facebook.github.io/react-native/docs/image.html#resizemode
   */
  resizeMode?: 'cover' | 'contain' | 'center';

  /**
   * Determines how Lottie should render
   * Refer to LottieAnimationView#setRenderMode(RenderMode) for more information.
   */
  renderMode?: 'AUTOMATIC' | 'HARDWARE' | 'SOFTWARE';

  /**
   * [Android]. Allows to specify kind of cache used for animation. Default value weak.
   * strong - cached forever
   * weak   - cached as long it is in active use
   * none   - not cached
   */
  cacheStrategy?: 'strong' | 'weak' | 'none';

  /**
   * A boolean flag indicating whether or not the animation should start automatically when
   * mounted. This only affects the imperative API.
   */
  autoPlay?: boolean;

  /**
   * A boolean flag indicating whether or not the animation should size itself automatically
   * according to the width in the animation's JSON. This only works when source is an actual
   * JS object of an animation.
   */
  autoSize?: boolean;

  /**
   * A boolean flag to enable merge patching in android.
   */
  enableMergePathsAndroidForKitKatAndAbove?: boolean;

  /**
   * A callback function which will be called when animation is finished. Note that this
   * callback will be called only when `loop` is set to false.
   */
  onAnimationFinish ?: (isCancelled: boolean) => void;

  /**
   * A callback function which will be called when the view has been laid out.
   */
  onLayout?: (event: LayoutChangeEvent) => void;

  /**
   * An array of layers you want to override its color filter.
   */
  colorFilters ?: Array<ColorFilter>;

  /**
   * A string to identify the component during testing
   */
  testID?: string;
}

export interface LoadingProps extends Omit<ActivityIndicatorProps, 'size'>, Omit<SpinnerProps, 'color' | 'size' > {
  size?: 'small' | 'large';
  margin?: number;
  marginTop?: number;
  marginBottom?: number;
  marginLeft?: number;
  marginRight?: number;
  marginHorizontal?: number;
  marginVertical?: number;
  overlay?: boolean;
  timeout?: number;
  visible?: boolean;
  textColor?: string;
  animatedLottieLoading?: keyof typeof AnimatedLottieLoading;
  animatedLottieLoadingProps?: AnimatedLottieViewProps;
  theme?: any;
}

interface State {
  visibleState?: boolean
}
class Loading extends Component<LoadingProps, State> {
  static defaultProps = {
    visible: true,
  };

  static getDerivedStateFromProps(nextProps: any, prevState: any) {
    const { visible, timeout } = nextProps;
    const { visibleState } = prevState;
    if (timeout) {
      return {
        visibleState,
      };
    }
    return {
      visibleState: visible,
    };
  }

  constructor(props: LoadingProps) {
    super(props);
    const { visible } = this.props;
    this.state = {
      visibleState: visible,
    };
  }

  componentDidMount() {
    const { timeout } = this.props;
    if (timeout) { setTimeout(() => this.setState({ visibleState: false }), timeout); }
  }

  render() {
    const {
      margin,
      marginTop,
      marginBottom,
      marginLeft,
      marginRight,
      marginHorizontal,
      marginVertical,
      overlay,
      color: colorProp,
      textColor: textColorProp,
      style: styleProp,
      textStyle: textStyleProp,
      animatedLottieLoading,
      animatedLottieLoadingProps,
      timeout,
      theme,
      ...otherProps
    } = this.props;
    const { visibleState } = this.state;
    /**
     * Color & Style
     */
    const color = colorProp || theme.colors.loading;
    const textColor = textColorProp || theme.colors.primaryText;

    const style: any = StyleSheet.flatten([
      {
        alignSelf: 'center'
      },
      {
        margin,
        marginTop,
        marginBottom,
        marginLeft,
        marginRight,
        marginHorizontal,
        marginVertical,
      },
      styleProp,
      textStyleProp
    ]);

    const textStyle = StyleSheet.flatten([
      {
        color: textColor,
      },
      textStyleProp
    ]);

    /**
     * TextContent
     */

    if (visibleState) {
      if (!overlay) {
        if (animatedLottieLoading) {
          return (
            <LottieView
              source={AnimatedLottieLoading[animatedLottieLoading]}
              loop
              autoPlay
              autoSize
              {...animatedLottieLoadingProps}
              style={style}
            />
          );
        }
        return <ActivityIndicator {...otherProps} color={color} style={style} />;
      }

      // Overlay
      if (animatedLottieLoading) {
        return (
          <Spinner
            {...otherProps}
            visible={visibleState}
            textContent={i18next.t('component:loading:loading')}
            textStyle={textStyle}
            color={color}
            customIndicator={(
              <LottieView
                source={AnimatedLottieLoading[animatedLottieLoading]}
                loop
                autoPlay
                autoSize
                {...animatedLottieLoadingProps}
                style={style}
              />
            )}
          />
        );
      }
      return (
        <Spinner
          {...otherProps}
          visible={visibleState}
          textContent={i18next.t('component:loading:loading')}
          textStyle={textStyle}
          color={color}
        />
      );
    }
    return null;
  }
}

export default withTheme(
  Loading as any as React.ComponentType<LoadingProps & ThemeProps<any>>
);
