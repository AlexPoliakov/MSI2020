const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const Dev = process.env.NODE_ENV === 'development';
const Prod = !Dev;

const optimization = () => {
	const config = {}
	if (Prod) {
		(config.minimize = true),
			(config.minimizer = [
				new OptimizeCssAssetsPlugin({ cssProcessorOptions: {
						map: {
							inline: false,
							annotation: true,
						},
					},
				}),
				new TerserPlugin(),
			]);
	}
	return config;
}

const devtool = () =>  Prod ? 'source-map' : '';

module.exports = {
	devtool: devtool(),
	context: path.resolve(__dirname, 'src'),
	entry: {
		main: './js/index.js',
	},
	output: {
		filename: '[name].[contenthash].js',
		path: path.resolve(__dirname, 'docs'),
	},
	devServer: {
		contentBase: path.join(__dirname, 'docs'),
		compress: true,
		port: 4200,
		hot: Dev,
	},
	plugins: [
		new HtmlWebpackPlugin({
			filename: 'index.html',
			inject: true,
			template: path.resolve(__dirname, 'src', 'index.html'),
		}),
		new CleanWebpackPlugin(),
		new MiniCssExtractPlugin({
			filename: 'style.[contenthash].css',
		}),
	],

	optimization: optimization(),

	module: {
		rules: [
			{
				test: /\.html$/,
				use: [{ loader: 'html-loader', options: { minimize: Prod } }],
			},
			{
				test: /\.css$/,
				use: [MiniCssExtractPlugin.loader, 'css-loader'],
			},
			{
				test: /\.(woff|woff2|ttf|eot)$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: '[name].[ext]',
							outputPath: 'assets/fonts',
						},
					},
				],
			},
			{
				test: /\.(png|svg|jpg|gif)$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: '[name].[ext]',
							outputPath: 'assets/icons',
						},
					},
				],
			},
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: [
							[
								'@babel/preset-env',
								{
									exclude: [
										'transform-async-to-generator',
										'transform-regenerator',
									],
								},
							],
						],
						plugins: [['module:fast-async', { spec: true }]],
					},
				},
			},
		],
	},
};