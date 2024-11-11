import {
  SafeAreaView,
  Text,
  View,
  TextInput,
  Animated,
  Dimensions,
  Pressable,
  Image,
} from "react-native";
import {
  Table,
  TableHeading,
  TableRow,
  TableData,
} from "~/components/shared/table";
import { useState } from "react";
import type { RouterInputs, RouterOutputs } from "~/utils/api";
import { api } from "~/utils/api";
import { PrimaryButton, SecondaryButton } from "~/components/core/button";
import { FormTextInput } from "~/components/shared/form/";
import { Can } from "~/providers/auth";
import CloseIcon from "~/app/assets/images/close-icon.png";
import EditIcon from "~/app/assets/images/edit-icon.svg";
import TrashIcon from "~/app/assets/images/trash-icon.svg";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { LoadingState } from "~/components/shared/displayStates/LoadingState";
import { ErrorState } from "~/components/shared/displayStates/ErrorState";
import { SearchBox } from "~/components/shared/searchComponent";
const windowHeight = Dimensions.get("window").height - 64;

type Product = RouterOutputs["products"]["read"][0];
type CreateProduct = RouterInputs["products"]["create"];
type UpdateTeam = RouterInputs["products"]["update"];

type ProductProps = {
  open: boolean;
  toggleOpen: () => void;
  isLoading?: boolean;
} & (
  | { handleSave: (_user: CreateProduct) => Promise<void> }
  | { product: Product; handleSave: (_user: UpdateTeam) => Promise<void> }
);

function isUpdateProductProps(props: ProductProps): props is {
  product: Product;
  handleSave: (_user: UpdateTeam) => Promise<void>;
  open: boolean;
  toggleOpen: () => void;
} {
  return "product" in props;
}

function ProductForm(props: ProductProps) {
  const [name, setName] = useState(
    isUpdateProductProps(props) ? props.product.name : "",
  );
  const [make, setMake] = useState(
    isUpdateProductProps(props) ? props.product.make : "",
  );
  const [cas, setCas] = useState(
    isUpdateProductProps(props) ? props.product.cas : "",
  );
  const [desc, setDesc] = useState(
    isUpdateProductProps(props) ? props.product.desc : "",
  );

  const handleSave = async () => {
    if (isUpdateProductProps(props)) {
      await props.handleSave({ id: props.product.id, name, make, cas, desc });
    } else {
      await props.handleSave({ name, make, cas, desc });
    }
  };

  return (
    <Animated.View
      style={{
        zIndex: 1,
        position: "absolute",
        right: props.open ? 0 : "-100%",
        width: "100%",
        height: windowHeight,
        flexDirection: "row",
      }}
    >
      <View style={{ flex: 1 }}>
        <Pressable
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "#000",
            opacity: 0.1,
          }}
          onPress={props.toggleOpen}
        ></Pressable>
      </View>
      <View
        style={{
          flex: 1,
          height: "100%",
          flexDirection: "column",
          backgroundColor: "#FFF",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            padding: 20,
            borderBottomWidth: 1,
            borderBottomColor: "#E2E8F0",
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: 800, fontFamily: "Avenir" }}>
            Add Product
          </Text>
          <Pressable onPress={props.toggleOpen}>
            <Image source={CloseIcon} />
          </Pressable>
        </View>
        <View
          style={{ flex: 1, padding: 20, flexDirection: "column", gap: 16 }}
        >
          <View
            style={{
              width: "100%",
              padding: 16,
              borderRadius: 12,
              borderColor: "#E2E8F0",
              borderWidth: 1,
              flexDirection: "column",
              gap: 16,
            }}
          >
            <FormTextInput
              label="Product Name"
              placeholder="Type product name"
              onChangeText={setName}
            />
            <FormTextInput
              label="Make"
              placeholder="Type product make"
              onChangeText={setMake}
            />
            <FormTextInput
              label="CAS"
              placeholder="Type product CAS"
              onChangeText={setCas}
            />
            <FormTextInput
              label="Description"
              placeholder="Type description of the product"
              numberOfLines={4}
              onChangeText={setDesc}
            />
          </View>
        </View>
        <View
          style={{
            padding: 16,
            borderTopWidth: 1,
            borderTopColor: "#E2E8F0",
            flexDirection: "row",
            justifyContent: "flex-end",
            gap: 16,
          }}
        >
          <SecondaryButton text="Cancel" />
          <PrimaryButton
            text="Save"
            onPress={handleSave}
            isLoading={props.isLoading}
          />
        </View>
      </View>
    </Animated.View>
  );
}

function UpdateProductForm(props: {
  open: boolean;
  product: Product;
  toggleOpen: () => void;
}) {
  const utils = api.useUtils();
  const { mutateAsync: updateProduct } = api.products.update.useMutation({
    onSuccess: () => {
      utils.products.read.invalidate().catch(console.error);
    },
  });

  async function handleSave(team: RouterInputs["products"]["update"]) {
    await updateProduct(team);
    props.toggleOpen();
  }

  return (
    <ProductForm
      open={props.open}
      product={props.product}
      toggleOpen={props.toggleOpen}
      handleSave={handleSave}
    />
  );
}

function CreateProductForm(props: { open: boolean; toggleOpen: () => void }) {
  const utils = api.useUtils();
  const { mutateAsync: createProduct } = api.products.create.useMutation({
    onSuccess: () => {
      utils.products.read.invalidate().catch(console.error);
    },
  });

  async function handleSave(product: CreateProduct) {
    await createProduct(product);
    props.toggleOpen();
  }

  return (
    <ProductForm
      open={props.open}
      toggleOpen={props.toggleOpen}
      handleSave={handleSave}
    />
  );
}

export default function Products() {
  const { data, isLoading, isError } = api.products.read.useQuery();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [productToUpdate, setProductToUpdate] = useState<Product | null>(null);
  const toggleDrawer = () => {
    setDrawerVisible(!drawerVisible);
  };
  const [products, setProducts] = useState<string>("");

  return (
    <GestureHandlerRootView>
      <SafeAreaView
        style={{
          backgroundColor: "#F9F9F9",
          position: "relative",
        }}
      >
        <Can I="read" a="Product">
          {!productToUpdate && (
            <CreateProductForm open={drawerVisible} toggleOpen={toggleDrawer} />
          )}
          {productToUpdate && (
            <UpdateProductForm
              open={!!productToUpdate}
              product={productToUpdate}
              toggleOpen={() => setProductToUpdate(null)}
            />
          )}
          <View
            style={{
              paddingHorizontal: 24,
              paddingVertical: 8,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <SearchBox
              placeholder="Search by products"
              setValue={setProducts}
              value={products}
            />

            <Can I="create" a="Product">
              <View style={{ flexDirection: "row", gap: 16 }}>
                <SecondaryButton text="Upload Products" />
                <PrimaryButton text="Add Products" onPress={toggleDrawer} />
              </View>
            </Can>
          </View>

          {isLoading ? (
            <LoadingState stateContent={"Please wait... Loading products"} />
          ) : isError ? (
            <ErrorState
              errorMessage={"Something went wrong, please try again."}
            />
          ) : (
            <View style={{ padding: 16, height: windowHeight }}>
              <Table style={{ backgroundColor: "#fff" }}>
                <TableHeading>
                  <TableData
                    style={{ fontSize: 12, color: "#475467", flex: 1 }}
                  >
                    Product ID
                  </TableData>
                  <TableData
                    style={{ fontSize: 12, color: "#475467", flex: 1 }}
                  >
                    Product Name
                  </TableData>
                  <TableData
                    style={{ fontSize: 12, color: "#475467", flex: 1 }}
                  >
                    Make
                  </TableData>
                  <TableData
                    style={{ fontSize: 12, color: "#475467", flex: 1 }}
                  >
                    CAS
                  </TableData>
                  <TableData
                    style={{ fontSize: 12, color: "#475467", flex: 1 }}
                  >
                    Description
                  </TableData>
                  <Can I="delete" a="Product">
                    <TableData
                      style={{ fontSize: 12, color: "#475467", flex: 1 }}
                    >
                      Actions
                    </TableData>
                  </Can>
                </TableHeading>
                {data?.map((product) => (
                  <TableRow id={product.id} key={product.id}>
                    <TableData style={{ flex: 1 }}>{product.id}</TableData>
                    <TableData style={{ flex: 1 }}>{product.name}</TableData>
                    <TableData style={{ flex: 1 }}>{product.make}</TableData>
                    <TableData style={{ flex: 1 }}>{product.cas}</TableData>
                    <TableData style={{ flex: 1 }}>{product.desc}</TableData>
                    <Can I="delete" a="Product">
                      <View
                        style={{
                          paddingHorizontal: 16,
                          paddingVertical: 7,
                          flexDirection: "row",
                          gap: 16,
                          flex: 1,
                        }}
                      >
                        <Can I="update" a="Product">
                          <Pressable
                            style={{
                              borderColor: "#E2E8F0",
                              borderWidth: 1,
                              borderRadius: 8,
                              padding: 8,
                              maxHeight: 32,
                              shadowOffset: { height: 1, width: 0 },
                              shadowOpacity: 0.05,
                              shadowColor: "#101828",
                            }}
                          >
                            <EditIcon />
                          </Pressable>
                        </Can>
                        <Can I="delete" a="Product">
                          <Pressable
                            style={{
                              borderColor: "#E2E8F0",
                              borderWidth: 1,
                              borderRadius: 8,
                              maxHeight: 32,
                              padding: 8,
                              shadowOffset: { height: 1, width: 0 },
                              shadowOpacity: 0.05,
                              shadowColor: "#101828",
                            }}
                          >
                            <TrashIcon />
                          </Pressable>
                        </Can>
                      </View>
                    </Can>
                  </TableRow>
                ))}
              </Table>
            </View>
          )}
        </Can>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
