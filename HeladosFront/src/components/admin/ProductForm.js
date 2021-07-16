import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { storage } from "../../firebase";
import { useHistory } from "react-router-dom";
import {
  Box,
  Stack,
  HStack,
  Button,
  Alert,
  AlertIcon,
  AlertDescription,
  CloseButton,
  FormControl,
  FormLabel,
  Input,
  Spacer,
  Image,
  Text,
  Textarea,
  Progress,
  FormErrorMessage,
  CircularProgress,
  useColorModeValue,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";
import Dropzone from "react-dropzone";
import { formatBytes } from "./formatBytes";
import "./dropzone.css";
import axiosClient from "../../utils/providers/AxiosClient";

const ProductForm = ({ currProducto }) => {
  const [formAlert, setFormAlert] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [productImage, setProductImage] = useState(
    currProducto?.product?.fotos ? [currProducto?.product?.fotos[0]?.foto] : []
  );
  const [imageError, setImageError] = useState({});

  const history = useHistory();

  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (currProducto) {
      setProductImage(
        currProducto?.product?.fotos[0]?.foto
          ? [currProducto?.product?.fotos[0]?.foto]
          : []
      );
      setValue("name", currProducto?.product?.name);
      setValue("description", currProducto?.product?.description);
      setValue("flavor", currProducto?.flavor);
      setValue("priceSmall", currProducto?.product?.precios?.filter((x) => {
        return x.size == "250ml"
      })[0].price);
      setValue("priceMedium", currProducto?.product?.precios?.filter((x) => {
        return x.size == "500ml"
      })[0].price);
      setValue("priceBig", currProducto?.product?.precios?.filter((x) => {
        return x.size == "1L"
      })[0].price);
    }
  }, [currProducto, setValue]);

  const uploadProduct = async (values) => {
    const producto = {
      name: values.name,
      description: values.description,
      flavor: values.flavor,
    };

    console.log("producto", producto);
    console.log("image", productImage);

    // Upload to server
    const isUpload = !!!currProducto?.id;
    let productID;

    if (isUpload) {
      const res = await axiosClient.post("/helados", producto);
      console.log("respuesta upload", res);
      productID = res.data.id;
      console.log(productID);
      const priceSmall = {
        size: "250ml",
        price: parseFloat(values.priceSmall),
        product: productID
      };
  
      const priceMedium = {
        size: "500ml",
        price: parseFloat(values.priceMedium),
        product: productID
      };
  
      const priceBig = {
        size: "1L",
        price: parseFloat(values.priceBig),
        product: productID
      };

      const prices = [priceSmall, priceMedium, priceBig];
      console.log(prices);
      for(var j = 0; j < 3; j++){
        const res = await axiosClient.post("/precioProducto", prices[j]);
        console.log(prices[j] + " uploaded", res);
      }
    } else {
      const res = await axiosClient.put(
        `/helados/${currProducto.id}`,
        producto
      );
      console.log("respuesta edit", res);
      productID = currProducto.id;
    }

    // Upload image if needed
    const willUploadImage = typeof values?.image !== "string";

    console.log("will upload image", willUploadImage);

    if (willUploadImage) {
      console.log("uploading image", values.image);

      const uploadTask = storage
        .ref()
        .child(`fotosHelados/${values.flavor}`)
        .put(values.image);

      setUploadProgress(0);
      setIsUploading(true);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          setUploadProgress(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
        },
        (error) => {
          throw error;
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then(async (downloadURL) => {
            console.log(
              "uploading product with id",
              productID,
              "image hosted on",
              downloadURL
            );

            const res = await axiosClient.post("/fotoProducto", {
              foto: downloadURL,
              product: productID,
            });
            console.log("res image upload", res);
          });
        }
      );
      setIsUploading(false);
    }

    setIsUploading(false);
  };

  const onSubmit = (values) => {
    if (!!!productImage || productImage?.length === 0) {
      setImageError({ message: "Adjunta imagen del producto" });
      return;
    }

    setIsLoading(true);

    values.image = productImage[0];

    uploadProduct(values)
      .then((_) => {
        setFormAlert({
          status: "success",
          message: "Producto registrado!",
        });
        setTimeout(() => {
          history.push("/admin/products");
        }, 2000);
      })
      .catch((_) => {
        setFormAlert({
          status: "alert",
          message: "El producto no pudo ser registrado",
        });
        setIsLoading(false);
      });
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          w={"100%"}
          p={8}
        >
          {formAlert && (
            <Box my={4}>
              <Alert status={formAlert.status} borderRadius={4}>
                <AlertIcon />
                <AlertDescription>{formAlert.message}</AlertDescription>
                <CloseButton
                  position="absolute"
                  right="8px"
                  top="8px"
                  onClick={() => setFormAlert(null)}
                />
              </Alert>
            </Box>
          )}
          <Stack spacing={4}>
            <FormControl
              id="name"
              isInvalid={!!errors?.name?.message}
              errortext={errors?.name?.message}
            >
              <FormLabel>Nombre del producto</FormLabel>
              <Input
                type="text"
                defaultValue={currProducto?.product?.name}
                {...register("name", {
                  required: "Ingresa el nombre del producto",
                })}
              />
              <FormErrorMessage>{errors?.name?.message}</FormErrorMessage>
            </FormControl>
            <FormControl
              id="description"
              isInvalid={!!errors?.description?.message}
              errortext={errors?.description?.message}
            >
              <FormLabel>Descripción del producto</FormLabel>
              <Textarea
                type="text"
                defaultValue={currProducto?.description}
                {...register("description", {
                  required: "Ingresa la descripción del producto",
                })}
              />
              <FormErrorMessage>
                {errors?.description?.message}
              </FormErrorMessage>
            </FormControl>
            <HStack>
              <FormControl
                id="flavor"
                isInvalid={!!errors?.flavor?.message}
                errortext={errors?.flavor?.message}
              >
                <FormLabel>Sabor del producto</FormLabel>
                <Input
                  type="text"
                  defaultValue={currProducto?.flavor}
                  {...register("flavor", {
                    required: "Ingresa el sabor del producto",
                  })}
                />
                <FormErrorMessage>{errors?.flavor?.message}</FormErrorMessage>
              </FormControl>
            </HStack>
            <HStack spacing={10} hidden={!!currProducto?.id}>
              <FormControl
                id="priceSmall"
                isInvalid={!!errors?.priceSmall?.message}
                errortext={errors?.priceSmall?.message}
              >
                <FormLabel>Precio del producto pequeño</FormLabel>
                <NumberInput defaultValue={100} precision={2} step={5}
                    >
                      <NumberInputField  {...register("priceSmall", {
                      required: "Ingresa el precio por el tamaño pequeño",
                    })}/>
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                <FormErrorMessage>{errors?.priceSmall?.message}</FormErrorMessage>
              </FormControl>

              <FormControl
                id="priceMedium"
                isInvalid={!!errors?.priceMedium?.message}
                errortext={errors?.priceMedium?.message}
              >
                <FormLabel>Precio del producto mediano</FormLabel>
                <NumberInput defaultValue={200}
                  precision={2} step={5}
                    >
                      <NumberInputField  {...register("priceMedium", {
                      required: "Ingresa el precio por el tamaño mediano",
                    })}/>
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                <FormErrorMessage>{errors?.priceMedium?.message}</FormErrorMessage>
              </FormControl>

              <FormControl
                id="priceBig"
                isInvalid={!!errors?.priceBig?.message}
                errortext={errors?.priceBig?.message}
              >
                <FormLabel>Precio del producto grande</FormLabel>
                <NumberInput defaultValue={300}
                  precision={2} step={5}
                    >
                      <NumberInputField  {...register("priceBig", {
                      required: "Ingresa el precio por el tamaño grande",
                    })}/>
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                <FormErrorMessage>{errors?.priceBig?.message}</FormErrorMessage>
              </FormControl>
            </HStack>
            <FormControl
              id="image"
              isInvalid={imageError.message}
              errortext={imageError.message}
            >
              <FormLabel>Imagen de producto</FormLabel>
              <Dropzone
                accept={"image/*"}
                maxSize={5242880}
                onDrop={(acceptedFiles, fileRejections) => {
                  setImageError({});

                  fileRejections.forEach((file) => {
                    file.errors.forEach((err) => {
                      if (err.code === "file-too-large") {
                        setImageError({
                          message:
                            "El archivo ingresado sobrepasa el límite de tamaño (5 MB)",
                        });
                      }

                      if (err.code === "file-invalid-type") {
                        setImageError({
                          message:
                            "El archivo ingresado no cumple con formato de imagen",
                        });
                      }
                    });
                  });

                  acceptedFiles.map((file) =>
                    Object.assign(file, {
                      preview: URL.createObjectURL(file),
                      formattedSize: formatBytes(file.size),
                    })
                  );
                  setProductImage(acceptedFiles);
                }}
              >
                {({ getRootProps, getInputProps }) => (
                  <div className={`chakra-dropzone`} {...getRootProps()}>
                    <Input {...getInputProps()} />
                    <p>
                      Arrastra archivos aquí o haz click para subir. (max. 5 MB)
                    </p>
                  </div>
                )}
              </Dropzone>
              <FormErrorMessage>{imageError.message}</FormErrorMessage>
              {productImage &&
                productImage.map((file, index) => (
                  <Box
                    maxH={"65px"}
                    borderWidth="1px"
                    borderRadius="lg"
                    overflow="hidden"
                    my={"2"}
                    key={index}
                  >
                    <HStack>
                      {file?.name ? (
                        <>
                          <Image h={"65px"} mr={"2"} src={file.preview} />
                          <Text>{file.name}</Text>
                          <Spacer />
                          <Text>{file.formattedSize}</Text>
                        </>
                      ) : (
                        <>
                          <Image h={"65px"} mr={"2"} src={file} />
                          <Text>Imagen guardada en servidor</Text>
                          <Spacer />
                        </>
                      )}
                      <Box px={"3"}>
                        <CloseButton
                          onClick={(_) => {
                            let images = [...productImage];
                            images.splice(index, 1);
                            setProductImage(images);
                          }}
                        />
                      </Box>
                    </HStack>
                  </Box>
                ))}
            </FormControl>
            <Stack spacing={10}>
              <Button
                bg={"purple.400"}
                color={"white"}
                _hover={{
                  bg: "purple.500",
                }}
                type={"submit"}
                isDisabled={isLoading || isUploading}
              >
                {isLoading ? (
                  <CircularProgress isIndeterminate size="24px" color="teal" />
                ) : (
                  "Guardar producto"
                )}
              </Button>
              {isUploading && <Progress hasStripe value={uploadProgress} />}
            </Stack>
          </Stack>
        </Box>
      </form>
    </>
  );
};

export default ProductForm;
